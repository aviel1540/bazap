import React, { useState } from "react";
import { Row, Col, Card, Select, DatePicker, Divider } from "antd";
import Chart from "react-apexcharts";

const { Option } = Select;
const { RangePicker } = DatePicker;

const HomeDashboard = ({ projects }) => {
    const [filteredProjects, setFilteredProjects] = useState(projects);

    const handleFilterChange = (type, value) => {
        // Filtering logic based on selected filters (project, unit, voucher date, status, etc.)
        const updatedProjects = projects.filter((project) => {
            // Apply filtering conditions based on type and value
            return true; // Replace with actual filter logic
        });
        setFilteredProjects(updatedProjects);
    };

    return (
        <div>
            {/* Filter Controls */}
            <Row gutter={16} justify="space-between">
                <Col span={5}>
                    <Select
                        placeholder="Select Project"
                        style={{ width: "100%" }}
                        onChange={(value) => handleFilterChange("project", value)}
                    >
                        {projects.map((project) => (
                            <Option key={project._id} value={project._id}>
                                {project.projectName}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={5}>
                    <Select placeholder="Select Unit" style={{ width: "100%" }} onChange={(value) => handleFilterChange("unit", value)}>
                        {/* Populate units dynamically */}
                    </Select>
                </Col>
                <Col span={6}>
                    <RangePicker onChange={(value) => handleFilterChange("date", value)} style={{ width: "100%" }} />
                </Col>
                <Col span={5}>
                    <Select placeholder="Select Status" style={{ width: "100%" }} onChange={(value) => handleFilterChange("status", value)}>
                        <Option value="תקין">תקין</Option>
                        <Option value="מושבת">מושבת</Option>
                        {/* Add other statuses as needed */}
                    </Select>
                </Col>
            </Row>

            <Divider />

            {/* Chart Layout */}
            <Row gutter={16}>
                {/* Radial Bar Chart - Project Overview */}
                <Col span={24}>
                    <Card title="Project Completion Overview">
                        <Chart options={radialBarOptions} series={radialBarSeries} type="radialBar" />
                    </Card>
                </Col>

                {/* Pie Chart - Voucher Types */}
                <Col span={8}>
                    <Card title="Voucher Types">
                        <Chart options={pieOptions} series={pieSeries} type="pie" />
                    </Card>
                </Col>

                {/* Bar Chart - Device Status Breakdown */}
                <Col span={24}>
                    <Card title="Device Status Breakdown">
                        <Chart options={barOptions} series={barSeries} type="bar" />
                    </Card>
                </Col>

                {/* Polar Area Chart - Accessories Status */}
                <Col span={8}>
                    <Card title="Accessories Status">
                        <Chart options={polarOptions} series={polarSeries} type="polarArea" />
                    </Card>
                </Col>

                {/* Stacked Column Chart - Devices by Unit */}
                <Col span={24}>
                    <Card title="Devices by Unit">
                        <Chart options={stackedColumnOptions} series={stackedColumnSeries} type="bar" />
                    </Card>
                </Col>

                {/* Line Chart - Vouchers Over Time */}
                <Col span={16}>
                    <Card title="Vouchers Over Time">
                        <Chart options={lineOptions} series={lineSeries} type="line" />
                    </Card>
                </Col>

                {/* Heatmap - Accessories Quantity by Device Type */}
                <Col span={8}>
                    <Card title="Accessories Quantity by Device Type">
                        <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" />
                    </Card>
                </Col>

                {/* Area Chart - Device Status over Time */}
                <Col span={24}>
                    <Card title="Device Status over Time">
                        <Chart options={areaOptions} series={areaSeries} type="area" />
                    </Card>
                </Col>

                {/* Pie Chart - Units by Device Status */}
                <Col span={8}>
                    <Card title="Units by Device Status">
                        <Chart options={unitStatusPieOptions} series={unitStatusPieSeries} type="pie" />
                    </Card>
                </Col>

                {/* Donut Chart - Project Status */}
                <Col span={8}>
                    <Card title="Project Status">
                        <Chart options={donutOptions} series={donutSeries} type="donut" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomeDashboard;
