import { useState } from "react";
import { Row, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../Utils/projectAPI";
import Loader from "../../Components/Layout/Loader";
import FilterMenu from "../../Components/UI/FilterMenu";
import { getAllUnits } from "../../Utils/unitAPI";
import { getAllDevicesToDashboard } from "../../Utils/deviceApi";
import { aggregadeDevices } from "./utils";

const initialState = { unit: "all", projects: [] };

const HomeDashboard = () => {
    const [devices, setDevices] = useState([]);
    const { isLoading: projectIsLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
        onSuccess: (data) => {
            // setFilteredProjects(data);
        },
    });

    const { isLoading: devicesIsLoading } = useQuery({
        queryKey: ["dashboardDevices"],
        queryFn: getAllDevicesToDashboard,
        onSuccess: (data) => {
            setDevices(data);
        },
    });
    const { data: units, isLoading: isUnitLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const [filters, setFilters] = useState(initialState);
    const isLoading = devicesIsLoading || projectIsLoading;

    // useEffect(() => {
    //     if (projects) {
    //         // handleFilterChange();
    //     }
    // }, [projects, filters]);

    // const handleFilterChange = () => {
    //     const updatedProjects = projects.filter(() => {
    //         return true;
    //     });
    //     setFilteredProjects(updatedProjects);
    // };
    const unitOptions = !isUnitLoading
        ? units.map((unit) => {
              return { label: unit.unitsName, value: unit._id };
          })
        : [];
    unitOptions.unshift({ value: "all", label: "הכל" });
    const proejctOptions = !isLoading
        ? projects.map((project) => {
              return { label: project.projectName, value: project._id };
          })
        : [];

    if (isLoading) {
        return <Loader />;
    }
    return (
        <Card
            title={`בצפ מעקב`}
            extra={
                <FilterMenu
                    onFilterChange={setFilters}
                    clearAllFilters={() => setFilters(initialState)}
                    filtersConfig={[
                        {
                            multiple: true,
                            name: "project",
                            label: "פרוייקטים",
                            placeholder: "בחר פרוייקטים",
                            type: "select",
                            options: proejctOptions,
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
            }
        >
            {/* Chart Layout */}
            <Row gutter={[16, 16]} align="middle">
                {/* Radial Bar Chart - Project Overview */}
                {isLoading && <Loader />}
                {!isLoading && devices && (
                    <>
                        <div dir="ltr" style={{ direction: "ltr" }}>
                            {JSON.stringify(aggregadeDevices(devices))}
                        </div>
                    </>
                )}
            </Row>
        </Card>
    );
};

export default HomeDashboard;
//  {/* Chart Layout */}
//  <Row gutter={16}>
//  {/* Radial Bar Chart - Project Overview */}
//  <Col span={24}>
//      <Card title="Project Completion Overview">
//          <Chart options={radialBarOptions} series={radialBarSeries} type="radialBar" />
//      </Card>
//  </Col>

//  {/* Pie Chart - Voucher Types */}
//  <Col span={8}>
//      <Card title="Voucher Types">
//          <Chart options={pieOptions} series={pieSeries} type="pie" />
//      </Card>
//  </Col>

//  {/* Bar Chart - Device Status Breakdown */}
//  <Col span={24}>
//      <Card title="Device Status Breakdown">
//          <Chart options={barOptions} series={barSeries} type="bar" />
//      </Card>
//  </Col>

//  {/* Polar Area Chart - Accessories Status */}
//  <Col span={8}>
//      <Card title="Accessories Status">
//          <Chart options={polarOptions} series={polarSeries} type="polarArea" />
//      </Card>
//  </Col>

//  {/* Stacked Column Chart - Devices by Unit */}
//  <Col span={24}>
//      <Card title="Devices by Unit">
//          <Chart options={stackedColumnOptions} series={stackedColumnSeries} type="bar" />
//      </Card>
//  </Col>

//  {/* Line Chart - Vouchers Over Time */}
//  <Col span={16}>
//      <Card title="Vouchers Over Time">
//          <Chart options={lineOptions} series={lineSeries} type="line" />
//      </Card>
//  </Col>

//  {/* Heatmap - Accessories Quantity by Device Type */}
//  <Col span={8}>
//      <Card title="Accessories Quantity by Device Type">
//          <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" />
//      </Card>
//  </Col>

//  {/* Area Chart - Device Status over Time */}
//  <Col span={24}>
//      <Card title="Device Status over Time">
//          <Chart options={areaOptions} series={areaSeries} type="area" />
//      </Card>
//  </Col>

//  {/* Pie Chart - Units by Device Status */}
//  <Col span={8}>
//      <Card title="Units by Device Status">
//          <Chart options={unitStatusPieOptions} series={unitStatusPieSeries} type="pie" />
//      </Card>
//  </Col>

//  {/* Donut Chart - Project Status */}
//  <Col span={8}>
//      <Card title="Project Status">
//          <Chart options={donutOptions} series={donutSeries} type="donut" />
//      </Card>
//  </Col>
// </Row>
