import { Card } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const tagColors = {
    "ממתין לעבודה": "#D3D3D3",
    בעבודה: "#2db7f5",
    תקין: "#28a745",
    מושבת: "#ffc107",
    "תקין - הוחזר ליחידה": "#28a745",
    "מושבת - הוחזר ליחידה": "#28a745",
};

const UnitsByDeviceStatusPieChart = ({ projects }) => {
    const unitStatusCounts = {};

    // Calculate status counts
    projects.forEach((project) => {
        project.vouchersList.forEach((voucher) => {
            voucher.deviceList.forEach((device) => {
                unitStatusCounts[device.status] = (unitStatusCounts[device.status] || 0) + 1;
            });
        });
    });

    const pieSeries = Object.values(unitStatusCounts);
    const pieLabels = Object.keys(unitStatusCounts);

    // Map colors based on the status
    const pieColors = pieLabels.map((status) => tagColors[status] || "#000000");

    const pieOptions = {
        chart: { type: "pie" },
        labels: pieLabels,
        colors: pieColors,
        dataLabels: {
            enabled: true,
            formatter: (val, { seriesIndex }) => `${pieLabels[seriesIndex]}: ${val.toFixed(1)}%`,
        },
        legend: {
            position: "bottom",
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} Devices`,
            },
        },
    };

    return (
        <Card title="סטטוסים לפי יחידות">
            <Chart options={pieOptions} series={pieSeries} type="pie" height={300} />
        </Card>
    );
};

UnitsByDeviceStatusPieChart.propTypes = {
    projects: PropTypes.array.isRequired,
};

export default UnitsByDeviceStatusPieChart;
