import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsInProject } from "../../../../Utils/projectAPI";
import { Row, Col, Card, Statistic, Progress } from "antd";
import Chart from "react-apexcharts";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import { getAllVouchers } from "../../../../Utils/voucherApi";

// Define tag colors for status pie chart
export const tagColors = {
    "ממתין לעבודה": "#d9d9d9", // default
    בעבודה: "#2db7f5", // original value
    תקין: "#52c41a", // success
    מושבת: "#faad14", // warning
    "תקין - הוחזר ליחידה": "#52c41a", // success
    "מושבת - הוחזר ליחידה": "#52c41a", // success
    "הסתיים - הוחזר ליחידה": "#52c41a", // success
};

const ProjectDashBoard = () => {
    const { projectId } = useProject();
    const { isLoading: isLoadingDevices, data: devices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllProductsInProject,
    });
    const { isLoading: isLoadingVoucher, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const { onShow } = useCustomModal();
    const isLoading = isLoadingDevices || isLoadingVoucher;

    // Prepare data for the charts
    const getTotalsByDeviceType = () => {
        const classifiedTotals = {};
        const nonClassifiedTotals = {};

        devices?.forEach((item) => {
            const deviceName = item.deviceTypeId.deviceName;
            if (item.deviceTypeId.isClassified) {
                classifiedTotals[deviceName] = (classifiedTotals[deviceName] || 0) + 1;
            } else {
                nonClassifiedTotals[deviceName] = (nonClassifiedTotals[deviceName] || 0) + (item.quantity || 1);
            }
        });

        return { classifiedTotals, nonClassifiedTotals };
    };

    const getTotalsByStatus = () => {
        const totals = {};
        devices?.forEach((item) => {
            const status = item.status;
            totals[status] = (totals[status] || 0) + 1;
        });
        return totals;
    };

    const getTotalsByUnit = () => {
        const totals = {};
        devices?.forEach((item) => {
            const unitName = item.unit.unitsName;
            totals[unitName] = (totals[unitName] || 0) + 1;
        });
        return totals;
    };

    const getClassifiedAndNonClassifiedCount = () => {
        let classifiedCount = 0;
        let nonClassifiedCount = 0;

        devices?.forEach((item) => {
            if (item.deviceTypeId.isClassified) {
                classifiedCount += 1;
            } else {
                nonClassifiedCount += item.quantity || 1; // Sum quantity if it's non-classified
            }
        });

        return { classifiedCount, nonClassifiedCount };
    };

    const getPercentageOfSpecificStatuses = () => {
        const relevantStatuses = ["הסתיים - הוחזר ליחידה", "תקין - הוחזר ליחידה", "מושבת - הוחזר ליחידה"];
        let matchingCount = 0;
        let totalCount = 0;

        devices?.forEach((item) => {
            totalCount += 1;
            if (relevantStatuses.includes(item.status)) {
                matchingCount += 1;
            }
        });

        return totalCount > 0 ? ((matchingCount / totalCount) * 100).toFixed(2) : 0;
    };

    const getVoucherTypeCounts = () => {
        let trueCount = 0;
        let falseCount = 0;

        vouchers?.forEach((voucher) => {
            if (voucher.type) {
                trueCount += 1; // Count for קבלה
            } else {
                falseCount += 1; // Count for ניפוק
            }
        });

        return { trueCount, falseCount };
    };

    const { classifiedTotals, nonClassifiedTotals } = getTotalsByDeviceType();
    const totalsByStatus = getTotalsByStatus();
    const totalsByUnit = getTotalsByUnit();
    const { classifiedCount, nonClassifiedCount } = getClassifiedAndNonClassifiedCount();
    const specificStatusesPercentage = getPercentageOfSpecificStatuses();
    const { trueCount, falseCount } = getVoucherTypeCounts();

    // Chart options and data for classified devices
    const classifiedDeviceTypeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: Object.keys(classifiedTotals),
        },
        yaxis: {
            tickAmount: 5, // Set this to control the number of ticks on the Y-axis
            min: 0,
            max: Math.max(...Object.values(classifiedTotals)) + 1,
        },
    };

    const nonClassifiedDeviceTypeChartOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: Object.keys(nonClassifiedTotals),
        },
        yaxis: {
            tickAmount: 5, // Set this to control the number of ticks on the Y-axis
            min: 0,
            max: Math.max(...Object.values(nonClassifiedTotals)) + 1,
        },
    };

    const statusChartOptions = {
        chart: {
            type: "pie",
            toolbar: {
                show: false,
            },
        },
        labels: Object.keys(totalsByStatus),
        colors: Object.keys(totalsByStatus).map((status) => tagColors[status] || "#000"),
    };

    const unitChartOptions = {
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: Object.keys(totalsByUnit),
        },
        stroke: {
            curve: "smooth", // Use smooth curve for spline area
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100],
            },
        },
    };

    const voucherTypeChartOptions = {
        chart: {
            type: "pie",
            toolbar: {
                show: false,
            },
        },
        labels: ["קבלה", "ניפוק"],
        colors: ["#52c41a", "#faad14"], // Colors for קבלה and ניפוק
    };

    const classifiedDeviceTypeChartData = {
        series: [
            {
                name: "מכשירים מסווגים",
                data: Object.values(classifiedTotals),
            },
        ],
    };

    const nonClassifiedDeviceTypeChartData = {
        series: [
            {
                name: "מכשירים לא מסווגים",
                data: Object.values(nonClassifiedTotals),
            },
        ],
    };

    const statusChartData = {
        series: Object.values(totalsByStatus),
    };

    const unitChartData = {
        series: [
            {
                name: "סך הכל לפי יחידה",
                data: Object.values(totalsByUnit),
            },
        ],
    };

    const voucherTypeChartData = {
        series: [trueCount, falseCount],
    };

    const showModal = () => {
        if (!isLoading) {
            onShow({
                name: "projectDashboard",
                title: "נתוני פרוייקט",
                width: "100%",
                body: (
                    <div className="p-5 bg-light">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Typography variant="h6" component="h3">
                                        סך הכל לפי סוג מכשיר (מכשירים מסווגים)
                                    </Typography>
                                    <Chart
                                        options={classifiedDeviceTypeChartOptions}
                                        series={classifiedDeviceTypeChartData.series}
                                        type="bar"
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Typography variant="h6" component="h3">
                                        סך הכל לפי סוג מכשיר (מכשירים לא מסווגים)
                                    </Typography>
                                    <Chart
                                        options={nonClassifiedDeviceTypeChartOptions}
                                        series={nonClassifiedDeviceTypeChartData.series}
                                        type="bar"
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Typography variant="h6" component="h3">
                                        סך הכל לפי סטטוס
                                    </Typography>
                                    <Chart options={statusChartOptions} series={statusChartData.series} type="pie" />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Typography variant="h6" component="h3">
                                        סך הכל לפי יחידה
                                    </Typography>
                                    <Chart options={unitChartOptions} series={unitChartData.series} type="area" />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Statistic title="מכשירים מסווגים" value={classifiedCount} />
                                </Card>
                                <Card>
                                    <Statistic title="מכשירים לא מסווגים" value={nonClassifiedCount} />
                                </Card>
                                <Card>
                                    <Statistic title="התקדמות סך הכל" value={`${specificStatusesPercentage}%`} />
                                    <Progress percent={specificStatusesPercentage} />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card>
                                    <Typography variant="h6" component="h3">
                                        סך הכל לפי סוג שובר (קבלה או ניפוק)
                                    </Typography>
                                    <Chart options={voucherTypeChartOptions} series={voucherTypeChartData.series} type="pie" />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ),
            });
        }
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={showModal}>
                    <ListItemIcon>
                        <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary="נתוני פרוייקט" />
                </ListItemButton>
            </ListItem>
        </>
    );
};

export default ProjectDashBoard;