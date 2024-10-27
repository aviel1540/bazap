import { useEffect, useState } from "react";
import { Row, Card, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../Utils/projectAPI";
import Loader from "../../Components/Layout/Loader";
import FilterMenu from "../../Components/UI/FilterMenu";
import { getAllUnits } from "../../Utils/unitAPI";
import { getAllDevicesToDashboard } from "../../Utils/deviceApi";
import { aggregateDevices } from "./utils";
import UnitsChart from "./Dashboard/UnitsChart";
import DeviceTypeChart from "./Dashboard/DevicesTypeChart";
import StatusChart from "./Dashboard/StatusChart";
import ProjectChart from "./Dashboard/ProjectChart";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { FileExcelOutlined } from "@ant-design/icons";
import { createExcel } from "../../Utils/excelUtils";
import VoucherChart from "./Dashboard/VoucherChart";

const HomeDashboard = () => {
    const [filteredDevices, setFilteredDevices] = useState([]);
    const { isLoading: projectIsLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    const { isLoading: devicesIsLoading, data: devices } = useQuery({
        queryKey: ["dashboardDevices"],
        queryFn: getAllDevicesToDashboard,
    });
    useEffect(() => {
        if (devices) {
            setFilteredDevices(devices);
        }
    }, [devices]);

    const { data: units, isLoading: isUnitLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const getFiltersAndUpdatePage = (filters) => {
        const { unit, project, openProjectOnly, deviceStatus, monthRange } = filters;
        const filteredDevicesData = devices.filter((device) => {
            const unitMatch = unit === "all" || device.unit._id === unit;

            let projectMatch = false;
            if (project == undefined || project == null || project?.length === 0) {
                projectMatch = true;
            } else {
                projectMatch = project.includes(device.project._id);
            }

            const projectStatusMatch = !openProjectOnly || (openProjectOnly && !device.project.finished);
            const deviceStatusMatch =
                deviceStatus == "all" ||
                (deviceStatus == true && device.voucherOut == null) ||
                (deviceStatus == false && device.voucherOut != null);

            // Filter by date range
            let dateMatch = true;
            if (monthRange != null) {
                const [startFilterDate, endFilterDate] = monthRange;
                if (startFilterDate && endFilterDate) {
                    const startDate = new Date(device.voucherIn.date);
                    const endDate = device.voucherOut ? new Date(device.voucherOut.date) : null;
                    const filterStart = new Date(startFilterDate);
                    const filterEnd = new Date(endFilterDate);
                    dateMatch = startDate >= filterStart && (endDate == null || filterEnd <= endDate);
                }
            }

            // return true;
            return unitMatch && projectMatch && projectStatusMatch && deviceStatusMatch && dateMatch;
        });

        setFilteredDevices(filteredDevicesData);
    };

    const isLoading = devicesIsLoading || projectIsLoading;

    const unitOptions = !isUnitLoading
        ? units.map((unit) => {
              return { label: unit.unitsName, value: unit._id };
          })
        : [];
    unitOptions.unshift({ value: "all", label: "הכל" });

    const projectOptions = !isLoading
        ? projects.map((project) => {
              return { label: project.projectName, value: project._id };
          })
        : [];

    if (isLoading) {
        return <Loader />;
    }
    const exportDashboardAsExcel = () => {
        const devicesData = [["פרוייקט", "יחידה", "צ' מכשיר", "סוג מכשיר", "מקט", "כמות", "סטטוס"]];
        // Sort devices by project, unit, and status
        const sortedDevices = filteredDevices.sort((a, b) => {
            if (a.project.projectName > b.project.projectName) return 1;
            if (a.project.projectName < b.project.projectName) return -1;

            if (a.unit.unitsName > b.unit.unitsName) return 1;
            if (a.unit.unitsName < b.unit.unitsName) return -1;

            if (a.status > b.status) return 1;
            if (a.status < b.status) return -1;

            return 0;
        });

        // Push sorted data into devicesData array
        sortedDevices.forEach((device) => {
            devicesData.push([
                device.project.projectName,
                device.unit.unitsName,
                device.serialNumber,
                device.deviceTypeId.deviceName,
                device.deviceTypeId.catalogNumber,
                device.quantity ? device.quantity : 1,
                device.status,
            ]);
        });
        createExcel(devicesData, 'נתוני בצ"פ מעקב');
    };
    const data = aggregateDevices(filteredDevices);

    return (
        <Card
            title={`בצפ מעקב`}
            extra={
                <Space>
                    <FilterMenu
                        onFilterChange={getFiltersAndUpdatePage}
                        filtersConfig={[
                            {
                                name: "deviceStatus",
                                label: "סטטוס מכשירים",
                                type: "radio",
                                value: "all",
                                options: [
                                    { label: "הכל", value: "all" },
                                    { label: 'בבצ"פ', value: true },
                                    { label: "מכשירים שיצאו", value: false },
                                ],
                            },
                            {
                                name: "openProjectOnly",
                                label: "סטטוס פרוייקטים",
                                checkedChildren: "כל הפרוייקטים",
                                unCheckedChildren: "פרוייקטים פתוחים",
                                type: "switch",
                                value: true,
                            },
                            {
                                name: "monthRange",
                                label: "תאריכים",
                                placeholder: ["תאריך התחלה", "תאריך סיום"],
                                type: "monthRange",
                            },
                            {
                                multiple: true,
                                name: "project",
                                label: "פרוייקטים",
                                placeholder: "בחר פרוייקטים",
                                type: "select",
                                options: projectOptions,
                            },
                            {
                                name: "unit",
                                label: "יחידות",
                                type: "select",
                                value: "all",
                                options: unitOptions,
                            },
                        ]}
                    />
                    <CustomButton type="light-success" icon={<FileExcelOutlined />} iconPosition="end" onClick={exportDashboardAsExcel}>
                        ייצא לאקסל
                    </CustomButton>
                </Space>
            }
        >
            <Row gutter={[16, 16]} align="middle">
                {isLoading && <Loader />}
                {!isLoading && filteredDevices && filteredDevices.length >= 0 && (
                    <>
                        <UnitsChart data={data.units} />
                        <DeviceTypeChart data={data.units} />
                        <StatusChart data={data} />
                        <ProjectChart data={data.projects} />
                        <VoucherChart data={data} />
                        {/* <>{JSON.stringify(data)}</> */}
                    </>
                )}
            </Row>
        </Card>
    );
};

export default HomeDashboard;
