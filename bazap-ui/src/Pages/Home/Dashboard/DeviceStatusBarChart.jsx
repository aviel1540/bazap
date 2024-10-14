import React from "react";
import { Card } from "antd";
import Chart from "react-apexcharts";

const DeviceStatusBarChart = ({ projects }) => {
    const statusCounts = {};

    projects.forEach((project) => {
        project.vouchersList.forEach((voucher) => {
            voucher.deviceList.forEach((device) => {
                statusCounts[device.status] = (statusCounts[device.status] || 0) + 1;
            });
        });
    });

    const barSeries = [
        {
            name: "Devices",
            data: Object.values(statusCounts),
        },
    ];

    const barOptions = {
        chart: { type: "bar" },
        xaxis: { categories: Object.keys(statusCounts) },
        colors: ["#008FFB"],
        dataLabels: { enabled: true },
    };

    return (
        <Card title="Device Status Breakdown">
            <Chart options={barOptions} series={barSeries} type="bar" height={350} />
        </Card>
    );
};

export default DeviceStatusBarChart;
