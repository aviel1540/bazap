import ReactApexChart from "react-apexcharts";
import { DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED } from "../../Utils/utils";

const ProjectChart = (props) => {
    const { data } = props;
    const series = [data.totalWaiting, data.totalInWork, data.totalFinished, data.totalOut];
    const options = {
        chart: {
            type: "donut",
            fontFamily: "Rubik, sans-serif",
        },
        colors: ["#F1BC00", "#5014D0", "#009EF7", "#47BE7D"],
        labels: [DeviceStatuses.WAIT_TO_WORK, DeviceStatuses.AT_WORK, FIXED_OR_DEFECTIVE, RETURNED],
        legend: {
            show: true,
            position: "bottom",
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return `${val.toFixed(0)}%`;
            },
            dropShadow: {
                enabled: false,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'סה"כ מכשירים',
                            formatter: function () {
                                return data.totalDevices;
                            },
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
        },
    };

    return <ReactApexChart options={options} series={series} type="donut" />;
};

export default ProjectChart;
