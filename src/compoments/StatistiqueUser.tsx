import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {axiosUtils} from '../Utils/axiosUtils.ts';
import {fetchStatistics} from '../Utils/GestionMethods/fetchStatistics.tsx';
import {fetchGroups} from '../Utils/GestionMethods/fetchGroups.tsx';
import {fetchStatisticsGroup} from '../Utils/GestionMethods/fetchStatisticsGroup.tsx';
import {FilterStatisticsModal} from './FilterStatisticsModal.tsx';
import {CustomPieChart} from './Statistics/PieChart.tsx'; // Updated import
import {Statistic} from '../../Types.ts';
import {Picker} from '@react-native-picker/picker';

export const StatistiqueUser: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([]); // Fetch spending statistics
  const [groups, setGroups] = useState<any[]>([]); // Fetch user's groups
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null); // Selected group for group-specific statistics
  const [showFilterModal, setShowFilterModal] = useState(false); // Show/hide filter modal
  const [formError, setFormError] = useState(''); // Form error message

  const {ApiGet} = axiosUtils();

  useEffect(() => {
    fetchStatistics(ApiGet, setStatistics);
    fetchGroups(ApiGet, setGroups);
  }, []);

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleGroupChange = async (itemValue: any) => {
    const groupId = itemValue;
    const group = groups.find(g => g.id === groupId);
    setSelectedGroup(group);
    if (group) {
      setStatistics([]);
      fetchStatisticsGroup(ApiGet, group.id, setStatistics);
    } else {
      setStatistics([]);
      fetchStatistics(ApiGet, setStatistics);
    }
  };

  const applyFilters = (filters: Record<string, string>) => {
    if (selectedGroup) {
      fetchStatisticsGroup(
        ApiGet,
        selectedGroup.id,
        setStatistics,
        filters,
        setFormError,
      );
    } else {
      fetchStatistics(ApiGet, setStatistics, filters, setFormError);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <Button title="Filtrer" onPress={toggleFilterModal} />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sélectionner un groupe</Text>
        <Picker
          selectedValue={selectedGroup ? selectedGroup.id : ''}
          style={styles.picker}
          onValueChange={handleGroupChange}>
          <Picker.Item label="Global" value="" />
          {groups.map((group, index) => (
            <Picker.Item key={index} label={group.name} value={group.id} />
          ))}
        </Picker>
      </View>
      <FilterStatisticsModal
        showFilterStatisticsModal={showFilterModal}
        toggleFilterStatisticsModal={toggleFilterModal}
        applyFilters={applyFilters}
        formError={formError}
      />
      <View style={styles.chartContainer}>
        <CustomPieChart data={statistics} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  chartContainer: {
    width: '100%',
    height: 100,
    marginTop: 20,
  },
});
