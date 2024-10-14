import { Card } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const ProjectCompletionAreaChart = ({ projects }) => {
    // Prepare data for the area chart
    const areaSeries = [
        {
            name: "התקדמות",
            data: projects.map((project) => {
                // Generate completion data; replace with actual calculation if available
                const completion = project.finished ? 100 : Math.floor(Math.random() * 100);
                return { x: project.projectName, y: completion };
            }),
        },
    ];

    // Sort the series data for a smoother visual progression
    areaSeries[0].data.sort((a, b) => a.y - b.y);

    // Configure the area chart options
    const areaOptions = {
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: "category",
            labels: {
                rotate: -45,
                style: {
                    fontSize: "12px",
                },
            },
            categories: projects.map((project) => project.projectName),
        },
        yaxis: {
            title: {
                text: "התקדמות (%)",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 100],
            },
        },
        colors: ["#008FFB"],
        legend: {
            show: false,
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}%`,
            },
        },
    };

    return (
        <Card title="תמותנ מצב התקמות פרוייקטים">
            <Chart options={areaOptions} series={areaSeries} type="area" height={350} />
        </Card>
    );
};

ProjectCompletionAreaChart.propTypes = {
    projects: PropTypes.array.isRequired,
};

export default ProjectCompletionAreaChart;
