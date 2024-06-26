import React from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {Statistic} from '../../../Types';

interface PieChartProps {
  data: Statistic[];
}

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
];

export const CustomPieChart: React.FC<PieChartProps> = ({data}) => {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const pieChartData = data.map((stat, index) => ({
    name: stat.category,
    population: stat.totalAmount,
    color: COLORS[index % COLORS.length],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  return (
    <View style={styles.container}>
      {pieChartData.length > 0 ? (
        <PieChart
          data={pieChartData}
          width={Dimensions.get('window').width - 40}
          height={240}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#7F7F7F',
    textAlign: 'center',
  },
});
