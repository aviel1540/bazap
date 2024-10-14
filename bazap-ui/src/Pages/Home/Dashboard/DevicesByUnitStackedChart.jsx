import { Card } from "antd";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const DevicesByUnitStackedChart = ({ projects }) => {
    const unitData = {};

    projects.forEach((project) => {
        project.vouchersList.forEach((voucher) => {
            voucher.deviceList.forEach((device) => {
                const unit = device.unit;
                const deviceType = device.deviceTypeId;

                if (!unitData[unit.unitsName]) unitData[unit.unitsName] = {};
                unitData[unit.unitsName][deviceType.deviceName] = (unitData[unit.unitsName][deviceType.deviceName] || 0) + 1;
            });
        });
    });

    const unitNames = Object.keys(unitData);
    const deviceTypes = [...new Set(unitNames.flatMap((unit) => Object.keys(unitData[unit])))];

    const stackedColumnSeries = deviceTypes.map((deviceType) => ({
        name: deviceType,
        data: unitNames.map((unit) => unitData[unit][deviceType] || 0),
    }));

    const stackedColumnOptions = {
        chart: { type: "bar", stacked: true },
        xaxis: { categories: unitNames },
        colors: ["#FF4560", "#00E396", "#775DD0", "#008FFB"],
    };

    return (
        <Card title="Devices by Unit">
            <Chart options={stackedColumnOptions} series={stackedColumnSeries} type="bar" height={450} />
        </Card>
    );
};

DevicesByUnitStackedChart.propTypes = {
    projects: PropTypes.array,
};
export default DevicesByUnitStackedChart;
