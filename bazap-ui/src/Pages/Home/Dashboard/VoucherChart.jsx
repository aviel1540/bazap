import { Card, Col, Typography } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const VoucherChart = ({ data }) => {
    const vouhcerChartsOptions = {
        series: [data.vouchers.vouchersIn, data.vouchers.vouchersOut],
        options: {
            chart: {
                type: "donut",
            },
            labels: ["שוברי קבלה", "שוברי ניפוק"],
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
        },
    };
    return (
        <Col span={12}>
            <Card bordered={false}>
                <Typography.Title level={4}>{"חלוקת שוברים לפי סוג"}</Typography.Title>
                <Chart options={vouhcerChartsOptions.options} series={vouhcerChartsOptions.series} type="pie" height={175} />
            </Card>
        </Col>
    );
};
VoucherChart.propTypes = {
    data: PropTypes.object.isRequired,
};
export default VoucherChart;
