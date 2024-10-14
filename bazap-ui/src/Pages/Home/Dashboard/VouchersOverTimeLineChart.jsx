import React from "react";
import { Card } from "antd";
import Chart from "react-apexcharts";

const VouchersOverTimeLineChart = ({ projects }) => {
    const voucherCounts = {};

    projects.forEach((project) => {
        project.vouchersList.forEach((voucher) => {
            const date = voucher.date.split("T")[0];
            voucherCounts[date] = (voucherCounts[date] || 0) + 1;
        });
    });

    const lineSeries = [
        {
            name: "Vouchers",
            data: Object.entries(voucherCounts).map(([date, count]) => ({ x: date, y: count })),
        },
    ];

    const lineOptions = {
        chart: { type: "line" },
        xaxis: { type: "datetime" },
        colors: ["#008FFB"],
    };

    return (
        <Card title="Vouchers Over Time">
            <Chart options={lineOptions} series={lineSeries} type="line" height={350} />
        </Card>
    );
};

export default VouchersOverTimeLineChart;
