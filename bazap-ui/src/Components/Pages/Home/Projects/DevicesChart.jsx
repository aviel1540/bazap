import { useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";

const DevicesChart = () => {
    const theme = useTheme();
    // Sample data, replace this with your actual data
    function generateRandomProjectsData(numProjects, maxDevicesPerProject) {
        const projectNames = ["מיפוי", "חרבות ברזל", "תחבורה", "בנייה", "מדעים", "טכנולוגיה", "אמנות", "ספורט"];

        const getRandomProjectName = () => {
            const randomIndex = Math.floor(Math.random() * projectNames.length);
            return `${projectNames[randomIndex]} ${Math.floor(Math.random() * 1000)}`;
        };

        const getRandomStatus = () => {
            const statuses = ["FIXED_RETURN", "DEFECTIVE_RETURN"];
            const randomIndex = Math.floor(Math.random() * statuses.length);
            return statuses[randomIndex];
        };

        const generateRandomDevices = () => {
            const numDevices = Math.ceil(Math.random() * maxDevicesPerProject);
            return Array.from({ length: numDevices }, () => ({ status: getRandomStatus() }));
        };

        const projectsData = [];

        for (let i = 0; i < numProjects; i++) {
            const project = {
                projectName: getRandomProjectName(),
                devices: generateRandomDevices(),
            };
            projectsData.push(project);
        }

        return projectsData;
    }

    // Example usage:
    const projectsData = generateRandomProjectsData(7, 20);
    // Prepare data for ApexChart
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
            categories: projectsData.map((project) => project.projectName),
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
            data: projectsData.map((project) =>
                project.devices.reduce((acc, device) => {
                    return acc + (device.status === "DEFECTIVE_RETURN" ? 1 : 0);
                }, 0),
            ),
        },
        {
            name: "תקין",
            data: projectsData.map((project) =>
                project.devices.reduce((acc, device) => {
                    return acc + (device.status === "FIXED_RETURN" ? 1 : 0);
                }, 0),
            ),
        },
    ];

    return <ReactApexChart options={options} series={series} type={options.chart.type} height={options.chart.height} />;
};

export default DevicesChart;
