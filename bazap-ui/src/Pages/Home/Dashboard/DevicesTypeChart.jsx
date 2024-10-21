import { Card, Col, Typography } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const DeviceTypeChart = ({ data }) => {
    const units = Object.keys(data);
    const deviceTypes = [...new Set(Object.values(data).flatMap((unit) => Object.keys(unit.deviceTypes)))];

    const series = deviceTypes.map((deviceType) => ({
        name: deviceType,
        data: units.map((unit) => data[unit].deviceTypes[deviceType] || 0),
    }));

    const deviceTypeChartOptions = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: units,
        },

        legend: {
            position: "top",
        },
    };

    return (
        <Col span={24}>
            <Card bordered={false}>
                <Typography.Title level={4}>{'סה"כ מכשירים לפי סוג מכשיר ויחידה'}</Typography.Title>
                <Chart options={deviceTypeChartOptions} series={series} type="bar" height={350} />
            </Card>
        </Col>
    );
};

DeviceTypeChart.propTypes = {
    data: PropTypes.object.isRequired,
};

export default DeviceTypeChart;
