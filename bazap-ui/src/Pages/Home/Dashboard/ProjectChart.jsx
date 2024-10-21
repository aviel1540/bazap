import { Card, Col, Typography } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const ProjectChart = ({ data }) => {
    const closedPercentage = Math.round((data.finished / (data.finished + data.nonFinished)) * 100);
    const projectChartOptions = {
        series: [closedPercentage],
        options: {
            chart: {
                type: "radialBar",
                offsetY: -20,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: "#999",
                            opacity: 1,
                            blur: 2,
                        },
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            offsetY: -2,
                            fontSize: "22px",
                        },
                    },
                },
            },
            grid: {
                padding: {
                    top: -10,
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91],
                },
            },
            labels: ["Average Results"],
        },
    };
    return (
        <Col span={12}>
            <Card bordered={false}>
                <Typography.Title level={4}>{"אחוז הפרוייקטים הסגורים"}</Typography.Title>
                <Chart options={projectChartOptions.options} series={projectChartOptions.series} type="radialBar" height={350} />
            </Card>
        </Col>
    );
};

ProjectChart.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ProjectChart;
