import { Card, Col, Typography } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { sortObjectByValue } from "../../../Utils/utils";

const StatusChart = ({ data }) => {
    const statuses = sortObjectByValue(data.status);
    const deviceTypeChartOptions = {
        series: [
            {
                name: "",
                data: Object.values(statuses),
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    horizontal: true,
                    distributed: true,
                    isFunnel: true,
                },
            },
            colors: ["#F44F5E", "#E55A89", "#D863B1", "#CA6CD8", "#B57BED", "#8D95EB", "#62ACEA", "#4BC3E6"],
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex];
                },
                dropShadow: {
                    enabled: true,
                },
            },
            title: {
                align: "middle",
            },
            xaxis: {
                categories: Object.keys(statuses),
            },
            legend: {
                show: false,
            },
        },
    };

    return (
        <Col span={24}>
            <Card bordered={false}>
                <Typography.Title level={4}>{"פילוג סטטוסים"}</Typography.Title>
                <Chart options={deviceTypeChartOptions.options} series={deviceTypeChartOptions.series} type="bar" height={350} />
            </Card>
        </Col>
    );
};

StatusChart.propTypes = {
    data: PropTypes.object.isRequired,
};

export default StatusChart;
