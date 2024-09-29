// import { useProject } from "../../../Components/store/ProjectContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsInProject } from "../../../Utils/projectAPI";
import { Row, Col, Card, Typography, Button } from "antd";
import Chart from "react-apexcharts";
import { getAllVouchers } from "../../../Utils/voucherApi";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import Loader from "../../../Components/Layout/Loader";
import { useParams } from "react-router";
import { PictureOutlined, RightCircleOutlined } from "@ant-design/icons";
import CustomButton from "../../../Components/UI/CustomButton/CustomButton";
import { useNavigate } from "react-router";

const ProjectDashBoardPage = () => {
    const navigate = useNavigate();

    const { id: projectId } = useParams();
    const { isLoading: isLoadingDevices, data: devices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllProductsInProject,
    });
    const { isLoading: isLoadingVoucher } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const isLoading = isLoadingDevices || isLoadingVoucher;
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
    const navigateBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <Loader />;
    }
    return (
        <Card>
            <Row justify="space-between" className="mb-2">
                <CustomButton type="light-primary" onClick={navigateBack}>
                    <RightCircleOutlined className="fs-4" />
                </CustomButton>
                <Button color="primary" variant="filled" icon={<PictureOutlined />} iconPosition="end" onClick={exportDashboardAsImage}>
                    ייצא כתמונה
                </Button>
            </Row>
            <div id="dashboard-content">
                <Row gutter={[16, 16]}>
                    {/* Original chart: Total devices by device type */}
                    <Col span={16}>
                        <Card>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר
                            </Typography>
                            <Chart options={deviceTypeChartOptions} series={deviceTypeChartData.series} type="bar" height={350} />
                        </Card>
                    </Col>

                    {/* New chart: Classified devices by device type */}
                    <Col span={8}>
                        <Card>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר (מכשירים מסווגים)
                            </Typography>
                            <Chart
                                options={classifiedDeviceTypeChartOptions}
                                series={classifiedDeviceTypeChartData.series}
                                type="bar"
                                height={350}
                            />
                        </Card>
                    </Col>
                    {/* Original chart: Total devices by unit and device type */}
                    <Col span={16}>
                        <Card>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי יחידה וסוג מכשיר
                            </Typography>
                            <Chart options={unitDeviceTypeChartOptions} series={unitDeviceTypeChartData.series} type="bar" height={350} />
                        </Card>
                    </Col>

                    {/* New chart: Non-classified devices by device type */}
                    <Col span={8}>
                        <Card>
                            <Typography variant="h6" component="h3">
                                סך הכל לפי סוג מכשיר (מכשירים לא מסווגים)
                            </Typography>
                            <Chart
                                options={nonClassifiedDeviceTypeChartOptions}
                                series={nonClassifiedDeviceTypeChartData.series}
                                type="bar"
                                height={350}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default ProjectDashBoardPage;
