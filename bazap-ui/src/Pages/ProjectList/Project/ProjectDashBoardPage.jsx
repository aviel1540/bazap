// import { useProject } from "../../../Components/store/ProjectContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsInProject, getProjectData } from "../../../Utils/projectAPI";
import { Row, Col, Card, Typography, Button, Space } from "antd";
import Chart from "react-apexcharts";
import { getAllVouchers } from "../../../Utils/voucherApi";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import Loader from "../../../Components/Layout/Loader";
import { useParams } from "react-router";
import { FileExcelOutlined, PictureOutlined, RightCircleOutlined } from "@ant-design/icons";
import CustomButton from "../../../Components/UI/CustomButton/CustomButton";
import { useNavigate } from "react-router";
import { createExcel } from "../../../Utils/excelUtils";

const ProjectDashBoardPage = () => {
    const navigate = useNavigate();
    const { id: projectId } = useParams();
    const { isLoading: isProjectLoading, data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });
    const { isLoading: isLoadingDevices, data: devices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllProductsInProject,
    });
    const { isLoading: isLoadingVoucher } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const isLoading = isLoadingDevices || isLoadingVoucher || isProjectLoading;
    // Separate classified and non-classified devices by device type
    const getClassifiedAndNonClassifiedTotalsByDeviceType = () => {
        const classifiedTotals = {};
        const nonClassifiedTotals = {};

        devices?.forEach((item) => {
            const deviceName = item.deviceTypeId.deviceName;
            if (item.deviceTypeId.isClassified) {
                classifiedTotals[deviceName] = (classifiedTotals[deviceName] || 0) + (item.quantity || 1);
            } else {
                nonClassifiedTotals[deviceName] = (nonClassifiedTotals[deviceName] || 0) + (item.quantity || 1);
            }
        });

        return { classifiedTotals, nonClassifiedTotals };
    };

    // Data for classified and non-classified devices
    const { classifiedTotals, nonClassifiedTotals } = getClassifiedAndNonClassifiedTotalsByDeviceType();

    // Data for total devices by device type
    const getTotalsByDeviceType = () => {
        const totals = {};
        devices?.forEach((item) => {
            const deviceName = item.deviceTypeId.deviceName;
            totals[deviceName] = (totals[deviceName] || 0) + (item.quantity || 1);
        });
        return totals;
    };

    // Data for total devices by unit and device type
    const getTotalsByUnitAndDeviceType = () => {
        const totalsByUnit = {};
        devices?.forEach((item) => {
            const unitName = item.unit.unitsName;
            const deviceName = item.deviceTypeId.deviceName;

            if (!totalsByUnit[unitName]) {
                totalsByUnit[unitName] = {};
            }
            totalsByUnit[unitName][deviceName] = (totalsByUnit[unitName][deviceName] || 0) + (item.quantity || 1);
        });
        return totalsByUnit;
    };

    // Chart options and data for classified devices by device type (Horizontal bar)
    const classifiedDeviceTypeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                borderRadiusApplication: "end",
            },
        },
        xaxis: {
            categories: Object.keys(classifiedTotals),
        },
        yaxis: {
            reversed: true,
        },
    };

    const classifiedDeviceTypeChartData = {
        series: [
            {
                name: "מכשירים מסווגים",
                data: Object.values(classifiedTotals),
            },
        ],
    };

    // Chart options and data for non-classified devices by device type (Horizontal bar)
    const nonClassifiedDeviceTypeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4, // Apply rounded corners
                borderRadiusApplication: "end", // Apply rounding at the end of the bars
            },
        },
        xaxis: {
            categories: Object.keys(nonClassifiedTotals),
        },
        yaxis: {
            reversed: true,
        },
    };

    const nonClassifiedDeviceTypeChartData = {
        series: [
            {
                name: "מכשירים לא מסווגים",
                data: Object.values(nonClassifiedTotals),
            },
        ],
    };

    const totalsByDeviceType = getTotalsByDeviceType();
    const totalsByUnitAndDeviceType = getTotalsByUnitAndDeviceType();

    const deviceTypeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: Object.keys(totalsByDeviceType),
        },
    };

    const deviceTypeChartData = {
        series: [
            {
                name: "Total Devices by Type",
                data: Object.values(totalsByDeviceType),
            },
        ],
    };

    const unitDeviceTypeChartOptions = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: Object.keys(totalsByUnitAndDeviceType),
        },
    };

    const unitDeviceTypeChartData = {
        series: Object.keys(totalsByDeviceType).map((deviceType) => ({
            name: deviceType,
            data: Object.keys(totalsByUnitAndDeviceType).map((unit) => totalsByUnitAndDeviceType[unit][deviceType] || 0),
        })),
    };

    // Function to export the dashboard as an image
    const exportDashboardAsImage = () => {
        const dashboardElement = document.getElementById("dashboard-content");
        if (dashboardElement) {
            htmlToImage
                .toPng(dashboardElement)
                .then((dataUrl) => {
                    download(dataUrl, "project_dashboard.png");
                })
                .catch((error) => {
                    console.error("Error exporting dashboard:", error);
                });
        }
    };
    const exportDashboardAsExcel = () => {
        const classifiedAndNonClassifiedData = [];
        const unitDeviceData = [];

        // Add headers for the Excel sheet (in Hebrew)
        classifiedAndNonClassifiedData.push(["סוג מכשיר", "מכשירים מסווגים", "מכשירים לא מסווגים"]);
        unitDeviceData.push(["יחידה", "סוג מכשיר", "כמות"]);

        // Add classified and non-classified totals
        Object.keys(totalsByDeviceType).forEach((deviceType) => {
            const classified = classifiedTotals[deviceType] || 0;
            const nonClassified = nonClassifiedTotals[deviceType] || 0;
            classifiedAndNonClassifiedData.push([deviceType, classified, nonClassified]);
        });

        // Add totals by unit and device type
        Object.keys(totalsByUnitAndDeviceType).forEach((unit) => {
            Object.keys(totalsByDeviceType).forEach((deviceType) => {
                const quantity = totalsByUnitAndDeviceType[unit][deviceType] || 0;
                unitDeviceData.push([unit, deviceType, quantity]);
            });
        });

        // Combine both datasets into one Excel sheet
        const finalData = [
            ...classifiedAndNonClassifiedData,
            [], // Add an empty row for separation
            ...unitDeviceData,
        ];

        // Call the createExcel function to export the data
        createExcel(finalData, "דוח_פרויקט");
    };

    const navigateBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            <Row justify="space-between" className="mb-2">
                <CustomButton type="light-primary" onClick={navigateBack}>
                    <RightCircleOutlined className="fs-4" />
                </CustomButton>
                <Space>
                    <Button color="primary" variant="filled" icon={<PictureOutlined />} iconPosition="end" onClick={exportDashboardAsImage}>
                        ייצא כתמונה
                    </Button>
                    <CustomButton type="light-success" icon={<FileExcelOutlined />} iconPosition="end" onClick={exportDashboardAsExcel}>
                        ייצא לאקסל
                    </CustomButton>
                </Space>
            </Row>
            <Card
                title={`נתוני פרוייקט - ${project.projectName}`}
                className="shadow-none"
                style={{ backgroundColor: "#f5f5f5" }}
                bordered={false}
                id="dashboard-content"
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר
                            </Typography>
                            <Chart options={deviceTypeChartOptions} series={deviceTypeChartData.series} type="bar" height={350} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי יחידה וסוג מכשיר
                            </Typography>
                            <Chart options={unitDeviceTypeChartOptions} series={unitDeviceTypeChartData.series} type="bar" height={350} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר (מכשירים מסווגים)
                            </Typography>
                            <Chart
                                style={{ direction: "ltr" }}
                                options={classifiedDeviceTypeChartOptions}
                                series={classifiedDeviceTypeChartData.series}
                                type="bar"
                                height={350}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר (מכשירים לא מסווגים)
                            </Typography>
                            <Chart
                                style={{ direction: "ltr" }}
                                options={nonClassifiedDeviceTypeChartOptions}
                                series={nonClassifiedDeviceTypeChartData.series}
                                type="bar"
                                height={350}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default ProjectDashBoardPage;
