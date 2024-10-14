import { Card } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const ProjectStatusDonutChart = ({ projects }) => {
    const finishedCount = projects.filter((project) => project.finished).length;
    const unfinishedCount = projects.length - finishedCount;

    const donutSeries = [finishedCount, unfinishedCount];

    const donutOptions = {
        chart: { type: "donut" },
        labels: ["הסתיים", "טרם הסתיים"],
        colors: ["#00E396", "#FF4560"],
    };

    return (
        <Card title="Project Status">
            <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
        </Card>
    );
};

ProjectStatusDonutChart.propTypes = {
    projects: PropTypes.array,
};
export default ProjectStatusDonutChart;
