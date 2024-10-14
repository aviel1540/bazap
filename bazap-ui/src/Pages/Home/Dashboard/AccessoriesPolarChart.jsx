import React from 'react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';

const AccessoriesPolarChart = ({ projects }) => {
  const statusCounts = {};

  projects.forEach(project => {
    project.vouchersList.forEach(voucher => {
      voucher.accessoriesList.forEach(accessory => {
        statusCounts[accessory.status] = (statusCounts[accessory.status] || 0) + accessory.quantity;
      });
    });
  });

  const polarSeries = Object.values(statusCounts);

  const polarOptions = {
    chart: { type: 'polarArea' },
    labels: Object.keys(statusCounts),
    colors: ['#FF4560', '#00E396', '#775DD0', '#008FFB'],
    stroke: { colors: ['#fff'] },
    fill: { opacity: 0.8 }
  };

  return (
    <Card title="Accessories Status">
      <Chart options={polarOptions} series={polarSeries} type="polarArea" height={300} />
    </Card>
  );
};

export default AccessoriesPolarChart;
