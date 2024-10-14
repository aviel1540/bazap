import React from 'react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';

const AccessoriesHeatmapChart = ({ projects }) => {
  const accessoriesData = {};

  projects.forEach(project => {
    project.vouchersList.forEach(voucher => {
      voucher.accessoriesList.forEach(accessory => {
        const deviceType = accessory.deviceTypeId;
        accessoriesData[deviceType] = (accessoriesData[deviceType] || 0) + accessory.quantity;
      });
    });
  });

  const heatmapSeries = Object.entries(accessoriesData).map(([deviceType, quantity]) => ({
    name: deviceType,
    data: [{ x: 'Quantity', y: quantity }]
  }));

  const heatmapOptions = {
    chart: { type: 'heatmap' },
    colors: ['#008FFB']
  };

  return (
    <Card title="Accessories Quantity by Device Type">
      <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" height={350} />
    </Card>
  );
};

export default AccessoriesHeatmapChart;
