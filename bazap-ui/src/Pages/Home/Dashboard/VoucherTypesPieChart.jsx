import { Card } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const VoucherTypesPieChart = ({ projects }) => {
    // Count the number of true and false voucher types across all projects
    const voucherTypeCounts = projects.reduce(
        (acc, project) => {
            project.vouchersList.forEach((voucher) => {
                if (voucher.type) {
                    acc.trueCount += 1;
                } else {
                    acc.falseCount += 1;
                }
            });
            return acc;
        },
        { trueCount: 0, falseCount: 0 },
    );

    // Data for the pie chart
    const pieSeries = [voucherTypeCounts.trueCount, voucherTypeCounts.falseCount];

    // Chart options
    const pieOptions = {
        chart: {
            type: "pie",
            toolbar: {
                show: false,
            },
        },
        labels: ["קבלה", "ניפוק"],
        colors: ["#00E396", "#FF4560"], // Custom colors for each type
        legend: {
            show: true,
            position: "bottom",
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`, // Show percentage with one decimal
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    return (
        <Card title="סוגי שוברים">
            <Chart options={pieOptions} series={pieSeries} type="pie" height={350} />
        </Card>
    );
};

VoucherTypesPieChart.propTypes = {
    projects: PropTypes.array,
};
export default VoucherTypesPieChart;
