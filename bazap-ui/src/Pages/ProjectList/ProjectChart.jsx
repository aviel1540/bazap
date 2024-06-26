import ReactApexChart from "react-apexcharts";
import { DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED } from "../../Utils/utils";

const ProjectChart = (props) => {
    const { data } = props;
    const series = [
        {
            name: "מסווגים",
            data: [data.totalWaiting, data.totalInWork, data.totalFinished, data.totalOut],
        },
        {
            name: 'צל"מ',
            data: [data.accessoriesWaiting, data.accessoriesInWork, data.accessoriesFinished, data.accessoriesOut],
        },
    ];

    const options = {
        chart: {
            type: "bar",
            stacked: true,
            fontFamily: "Rubik, sans-serif",
            toolbar: {
                show: false,
            },
        },
        colors: ["#F1BC00", "#5014D0", "#009EF7", "#47BE7D"],
        labels: [DeviceStatuses.WAIT_TO_WORK, DeviceStatuses.AT_WORK, FIXED_OR_DEFECTIVE, RETURNED],
        legend: {
            show: true,
            position: "bottom",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
            },
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: [DeviceStatuses.WAIT_TO_WORK, DeviceStatuses.AT_WORK, FIXED_OR_DEFECTIVE, RETURNED],
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
        },
    };

    return <ReactApexChart options={options} series={series} type="bar" />;
};

export default ProjectChart;
