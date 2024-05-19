import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {axiosUtils} from '../Utils/axiosUtils.ts';
import {fetchCategories} from '../Utils/GestionMethods/fetchCategories.tsx';

interface FilterStatisticsModalProps {
  showFilterStatisticsModal: boolean;
  toggleFilterStatisticsModal: () => void;
  applyFilters: (filters: Record<string, string>) => void;
  formError: string;
}

export const FilterStatisticsModal: React.FC<FilterStatisticsModalProps> = ({
  showFilterStatisticsModal,
  toggleFilterStatisticsModal,
  applyFilters,
  formError,
}) => {
  if (!showFilterStatisticsModal) return null;

  const {ApiGet} = axiosUtils();
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchCategories(ApiGet, setCategories);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    const activeFilters = {...filters};

    // Remove empty filters
    Object.keys(activeFilters).forEach(key => {
      if (!activeFilters[key]) {
        delete activeFilters[key];
      }
    });

    applyFilters(activeFilters);
    toggleFilterStatisticsModal();
  };

  return (
    <Modal
      visible={showFilterStatisticsModal}
      animationType="slide"
      transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrer les statistiques</Text>
            <Button title="Close" onPress={toggleFilterStatisticsModal} />
          </View>
          <View style={styles.modalBody}>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <Picker
                selectedValue={filters.category}
                onValueChange={value => handleFilterChange('category', value)}
                style={styles.picker}>
                <Picker.Item label="Toutes les catégories" value="" />
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de début</Text>
              <TextInput
                style={styles.input}
                value={filters.startDate}
                onChangeText={value => handleFilterChange('startDate', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de fin</Text>
              <TextInput
                style={styles.input}
                value={filters.endDate}
                onChangeText={value => handleFilterChange('endDate', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <Button
              title="Appliquer les filtres"
              onPress={handleFilterSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  formError: {
    color: 'red',
    marginBottom: 10,
  },
});
