import PropTypes from "prop-types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip, Form, Input, Radio, Select, Row, Col, Card, Flex, Divider, Button, Space } from "antd";
import { useProject } from "../../../Components/store/ProjectContext";
import { getAllUnits } from "../../../Utils/unitAPI";
import { getAllTechnicians } from "../../../Utils/technicianAPI";
import { sortOptions } from "../../../Utils/utils";
import { PlusOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Layout/Loader";
import UnitForm from "../../Unit/UnitForm";
import CustomButton from "../../../Components/UI/CustomButton/CustomButton";
import { addVoucherOut, exportVoucherToExcel } from "../../../Utils/voucherApi";
import TechnicianForm from "../../Technician/TechnicianForm";
import { useNavigate } from "react-router";
import AddVoucherAction from "./ProjectSideBar/AddVoucherAction";

const NewVoucherPage = ({ onCancel, formDefaultValues }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { projectId } = useProject();
    const [form] = Form.useForm();

    // State for modals
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
    const [technicianType, setTechnicianType] = useState({
        arrivedBy: formDefaultValues?.type === "true" ? "text" : "select",
        receivedBy: formDefaultValues?.type === "true" ? "select" : "text",
    });

    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingTechnicians, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const unitOptions = sortOptions(units, "unitsName")?.map((unit) => ({
        value: unit._id,
        label: unit.unitsName,
    }));

    const technicianOptions = sortOptions(technicians, "techName")?.map((technician) => ({
        value: technician.techName,
        label: technician.techName,
    }));

    const handleSave = (values) => {
        if (values.unit && typeof values.unit === "object") {
            values.unit = values.unit.value;
        }
        if (values.receivedBy && typeof values.receivedBy === "object") {
            values.receivedBy = values.receivedBy.value;
        }
        if (values.arrivedBy && typeof values.arrivedBy === "object") {
            values.arrivedBy = values.arrivedBy.value;
        }

         // const isDeliveryVoucher = values.type === "false";
         alert(values);
         return;
         // if (isDeliveryVoucher) {
         //     addVoucherOutMutation.mutate(values);
         // } else {
         //     values.accessoriesData = values.accessoriesData.map((item) => ({
         //         ...item,
         //         deviceTypeId: item.deviceTypeId?.value || item.deviceTypeId,
         //     }));
         //     addVoucherMutation.mutate(values);
         // }
    };

    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});
    const addVoucherOutMutation = useMutation(addVoucherOut, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel();
        },
    });

    const addVoucherMutation = useMutation(AddVoucherAction, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel();
        },
    });

    const isLoading = addVoucherOutMutation.isLoading || addVoucherMutation.isLoading || isLoadingUnits || isLoadingTechnicians;


    const handleTypeChange = (newValue) => {
        const boolValue = newValue === "true";
        setTechnicianType({
            arrivedBy: boolValue ? "text" : "select",
            receivedBy: boolValue ? "select" : "text",
        });
        // Reset these fields when switching between input types
        form.resetFields(["arrivedBy", "receivedBy"]);
    };

    const navigateBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Card title="שובר חדש">
                <Form form={form} initialValues={formDefaultValues} onFinish={handleSave} layout="vertical">
                    <Form.Item label="סוג שובר" name="type" rules={[{ required: true, message: "יש למלא שדה זה." }]}>
                        <Radio.Group
                            size="large"
                            block
                            optionType="button"
                            buttonStyle="solid"
                            className="d-flex"
                            onChange={(e) => handleTypeChange(e.target.value)}
                        >
                            <Radio.Button className="w-100 text-center" value="true">
                                קבלה
                            </Radio.Button>
                            <Radio.Button className="w-100 text-center" value="false">
                                ניפוק
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="יחידה" required>
                        <Row gutter={8}>
                            <Col span={23}>
                                <Form.Item name="unit" rules={[{ required: true, message: "יש למלא שדה זה." }]}>
                                    <Select options={unitOptions} placeholder="בחר יחידה" />
                                </Form.Item>
                            </Col>
                            <Col span={1}>
                                <Tooltip title="הוסף יחידה חדשה">
                                    <CustomButton type="light-primary" onClick={() => setIsUnitModalOpen(true)} icon={<PlusOutlined />} />
                                </Tooltip>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        label="חייל מנפק"
                        name="arrivedBy"
                        rules={[{ required: true, message: "יש למלא שדה זה." }]}
                        dependencies={["type"]} // Ensure revalidation on type change
                    >
                        {technicianType.arrivedBy === "text" ? (
                            <Input />
                        ) : (
                            <Row gutter={8}>
                                <Col span={23}>
                                    <Select options={technicianOptions} placeholder="בחר חייל מנפק" />
                                </Col>
                                <Col span={1}>
                                    <Tooltip title="הוסף טכנאי חדש">
                                        <CustomButton
                                            type="light-primary"
                                            onClick={() => setIsTechnicianModalOpen(true)}
                                            icon={<PlusOutlined />}
                                        />
                                    </Tooltip>
                                </Col>
                            </Row>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="חייל מקבל"
                        name="receivedBy"
                        rules={[{ required: true, message: "יש למלא שדה זה." }]}
                        dependencies={["type"]} // Ensure revalidation on type change
                    >
                        {technicianType.receivedBy === "text" ? (
                            <Input />
                        ) : (
                            <Row gutter={8}>
                                <Col span={23}>
                                    <Select options={technicianOptions} placeholder="בחר חייל מקבל" />
                                </Col>
                                <Col span={1}>
                                    <Tooltip title="הוסף טכנאי חדש">
                                        <CustomButton
                                            type="light-primary"
                                            onClick={() => setIsTechnicianModalOpen(true)}
                                            icon={<PlusOutlined />}
                                        />
                                    </Tooltip>
                                </Col>
                            </Row>
                        )}
                    </Form.Item>
                    <Divider />
                    <Flex justify="flex-end" align="center">
                        <Space>
                            <Button onClick={navigateBack}>בטל</Button>
                            <Button type="primary" htmlType="submit">
                                שמור
                            </Button>
                        </Space>
                    </Flex>
                </Form>
            </Card>

            <UnitForm formValues={null} open={isUnitModalOpen} onCancel={() => setIsUnitModalOpen(false)} isEdit={false} />
            <TechnicianForm
                formValues={null}
                open={isTechnicianModalOpen}
                onCancel={() => setIsTechnicianModalOpen(false)}
                isEdit={false}
            />
        </>
    );
};

NewVoucherPage.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formDefaultValues: PropTypes.object,
    open: PropTypes.bool,
};

export default NewVoucherPage;
