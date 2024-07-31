import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED } from "../../Utils/utils";

const ProjectChart = ({ vouchersList }) => {
    const calculateData = (vouchers) => {
        let allDevices = [];
        let allAccessories = [];

        vouchers.forEach((voucher) => {
            if (voucher.deviceList) allDevices = allDevices.concat(voucher.deviceList);
            if (voucher.accessoriesList) allAccessories = allAccessories.concat(voucher.accessoriesList);
        });

        return {
            totalDevices: allDevices.length,
            totalWaiting: allDevices.filter((device) => device.status === DeviceStatuses.WAIT_TO_WORK).length,
            totalInWork: allDevices.filter((device) => device.status === DeviceStatuses.AT_WORK).length,
            totalFinished: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE, DeviceStatuses.FIXED].includes(device.status)).length,
            totalOut: allDevices.filter((device) => [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(device.status))
                .length,
            accessoriesWaiting: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.WAIT_TO_WORK).length,
            accessoriesInWork: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.AT_WORK).length,
            accessoriesFinished: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.FINISHED).length,
            accessoriesOut: allAccessories.filter((accessory) => accessory.status === DeviceStatuses.FINISHED_OUT).length,
        };
    };

    const data = calculateData(vouchersList);

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

ProjectChart.propTypes = {
    vouchersList: PropTypes.arrayOf(
        PropTypes.shape({
            deviceList: PropTypes.arrayOf(
                PropTypes.shape({
                    status: PropTypes.string.isRequired,
                }),
            ),
            accessoriesList: PropTypes.arrayOf(
                PropTypes.shape({
                    status: PropTypes.string.isRequired,
                }),
            ),
        }),
    ).isRequired,
};

export default ProjectChart;
