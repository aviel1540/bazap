import { Card, Col, Typography } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const UnitsChart = ({ data }) => {
    const units = Object.keys(data);

    const series = [
        {
            name: 'סה"כ מסווגים',
            data: units.map((unit) => data[unit].classified),
        },
        {
            name: 'סה"כ צל"מ',
            data: units.map((unit) => data[unit].nonClassified),
        },
    ];

    const unitDeviceTypeChartOptions = {
        chart: {
            type: "area",
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
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
                <Typography.Title level={4}>{'סה"כ מכשירים לפי יחידה וסוג מכשיר'}</Typography.Title>
                <Chart options={unitDeviceTypeChartOptions} series={series} type="area" height={350} />
            </Card>
        </Col>
    );
};

UnitsChart.propTypes = {
    data: PropTypes.object.isRequired,
};

export default UnitsChart;
