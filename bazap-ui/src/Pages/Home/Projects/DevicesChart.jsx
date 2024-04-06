import { useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { DeviceStatuses } from "../../../Utils/utils";

const DevicesChart = ({ projects }) => {
    const theme = useTheme();

    const options = {
        chart: {
            height: 350,
            type: "area",
            toolbar: { show: false },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
        },
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
        xaxis: {
            categories: projects.map((project) => project.projectName),
        },
        yaxis: {
            labels: {
                align: "right",
                style: {
                    fontSize: "14px",
                    fontWeight: 600,
                },
            },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => {
                    return val;
                },
            },
        },
        colors: [theme.palette.success.main, theme.palette.warning.main],
    };

    const series = [
        {
            name: "מושבת",
            data: projects.map((project) =>
                project.vouchersList.reduce(
                    (acc, voucher) => acc + voucher.deviceList.filter((device) => device.status === DeviceStatuses.DEFECTIVE_RETURN).length,
                    0,
                ),
            ),
        },
        {
            name: "תקין",
            data: projects.map((project) =>
                project.vouchersList.reduce(
                    (acc, voucher) => acc + voucher.deviceList.filter((device) => device.status === DeviceStatuses.FIXED_RETURN).length,
                    0,
                ),
            ),
        },
    ];

    return <ReactApexChart options={options} series={series} type={options.chart.type} height={options.chart.height} />;
};

export default DevicesChart;
