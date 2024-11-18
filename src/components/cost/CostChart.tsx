import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { CostBreakdown } from '@/lib/types/cost';

interface CostChartProps {
  data: CostBreakdown[]; // Required, no es opcional
}

export const CostChart = ({ data, activeModel }: CostChartProps & { activeModel: number }) => {
  if (!data || data.length === 0) {
    return (
      <Alert status="error" borderRadius="md" h="400px">
        <AlertIcon />
        <Text>No cost breakdown data available</Text>
      </Alert>
    );
  }

  const chartData = data.map(item => ({
    day: item.day,
    // No multiplicamos por 8 ya que el costo ya está ajustado por el tamaño del equipo
    dailyCost: Number(item.cost.toFixed(2)),
    cumulativeCost: Number(item.cumulativeCost.toFixed(2))
  }));

  const roundToHundred = (num: number) => Math.ceil(num/100) * 100;
  const maxDailyCost = roundToHundred(Math.max(...chartData.map(d => d.dailyCost)));
  const maxCumulativeCost = roundToHundred(Math.max(...chartData.map(d => d.cumulativeCost)));

  return (
    <Box w="full" h="400px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day"
            label={{ value: 'Days', position: 'bottom', offset: 0 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, maxCumulativeCost]}
            label={{
              value: 'Cumulative Cost ($)',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, maxDailyCost]}
            label={{
              value: 'Daily Cost ($)',
              angle: 90,
              position: 'insideRight'
            }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `$${value.toFixed(2)}`,
              name
            ]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dailyCost"
            name="Daily Cost"
            stroke="#8884d8"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cumulativeCost"
            name="Cumulative Cost"
            stroke="#82ca9d"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};