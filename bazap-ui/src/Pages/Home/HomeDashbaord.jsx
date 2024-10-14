import { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../Utils/projectAPI";
import Loader from "../../Components/Layout/Loader";
import FilterMenu from "../../Components/UI/FilterMenu";
import { getAllUnits } from "../../Utils/unitAPI";
import ProjectCompletionRadialBar from "./Dashboard/ProjectCompletionAreaChart";
import VoucherTypesPieChart from "./Dashboard/VoucherTypesPieChart";
import DeviceStatusBarChart from "./Dashboard/DeviceStatusBarChart";
import AccessoriesPolarChart from "./Dashboard/AccessoriesPolarChart";
import DevicesByUnitStackedChart from "./Dashboard/DevicesByUnitStackedChart";
import AccessoriesHeatmapChart from "./AccessoriesHeatmapChart";
import UnitsByDeviceStatusPieChart from "./Dashboard/UnitsByDeviceStatusPieChart";
import ProjectStatusDonutChart from "./Dashboard/ProjectStatusDonutChart";
const initialState = { unit: "all", projects: [] };
const HomeDashboard = () => {
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
        onSuccess: (data) => {
            setFilteredProjects(data);
        },
    });
    const { data: units, isLoading: isUnitLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const [filters, setFilters] = useState(initialState);

    const [filteredProjects, setFilteredProjects] = useState();
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
                {!isLoading && filteredProjects && (
                    <>
                        <Col span={12}>
                            <ProjectCompletionRadialBar projects={filteredProjects} />
                        </Col>
                        <Col span={12}>
                            <VoucherTypesPieChart projects={filteredProjects} />
                        </Col>
                        <Col span={24}>
                            <DeviceStatusBarChart projects={filteredProjects} />
                        </Col>
                        <Col span={24}>
                            <DevicesByUnitStackedChart projects={filteredProjects} />
                        </Col>

                        <Col span={12}>
                            <AccessoriesPolarChart projects={filteredProjects} />
                        </Col>
                        <Col span={12}>
                            <AccessoriesHeatmapChart projects={filteredProjects} />
                        </Col>
                        <Col span={12}>
                            <UnitsByDeviceStatusPieChart projects={filteredProjects} />
                        </Col>
                        <Col span={12}>
                            <ProjectStatusDonutChart projects={filteredProjects} />
                        </Col>
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
