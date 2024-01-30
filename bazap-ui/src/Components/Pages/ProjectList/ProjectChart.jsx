/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ReactApexChart from "react-apexcharts";

const ProjectChart = (props) => {
    const { data } = props;
    const chartSeries = [data.totalWaiting, data.totalInWork, data.totalFinished, data.TotalOut];
    const chartOptions = {
        labels: ["ממתין לעבודה", "בעבודה", "הסתיים", "הוחזר"],
        colors: ["#F1BC00", "#5014D0", "#009EF7", "#47BE7D"],
        legend: {
            show: true,
            position: "bottom",
            markers: {
                width: 10,
                height: 10,
                radius: 5,
                offsetX: 5,
            },
        },
        chart: {
            fontFamily: "Rubik, sans-serif",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%", // Adjust the width of the donut
                },
            },
        },
    };
    return <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={250} />;
};

export default ProjectChart;
