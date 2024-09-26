import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
    Form,
    Input,
    Select,
    Checkbox,
    DatePicker,
    InputNumber,
    Button,
    Modal,
    Row,
    Col,
    Steps,
    AutoComplete,
    Space,
    Divider,
    Radio,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Loader from "../Layout/Loader";
import { useAdminAuth } from "../store/AdminAuthContext";

const { Step } = Steps;

const GenericForm = ({ fields, onSubmit, title, visible, onCancel, steps, initialValues, isLoading, isPasswordRequired, width = 800 }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firstFieldRef = useRef(null);
    const { isAuth, onLogin } = useAdminAuth();

    useEffect(() => {
        if (visible && initialValues) {
            const formattedInitialValues = Object.keys(initialValues).reduce((acc, key) => {
                if (fields.find((field) => field.name === key && field.type === "date")) {
                    acc[key] = dayjs(initialValues[key]);
                } else {
                    acc[key] = initialValues[key];
                }
                return acc;
            }, {});
            form.setFieldsValue(formattedInitialValues);
        }
    }, [visible, initialValues, form, fields]);

    useEffect(() => {
        if (visible && firstFieldRef.current) {
            setTimeout(() => {
                if (firstFieldRef.current && firstFieldRef.current.focus) {
                    firstFieldRef.current.focus();
                }
            }, 100);
        }
    }, [visible]);

    const renderField = (field, isFirstField = false) => {
        const commonProps = isFirstField ? { ref: firstFieldRef } : {};

        switch (field.type) {
            case "text":
                return <Input {...commonProps} />;
            case "number":
                return <InputNumber {...commonProps} />;
            case "select":
                return (
                    <Select {...commonProps}>
                        {field.options?.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case "checkbox":
                return <Checkbox {...commonProps}>{field.label}</Checkbox>;
            case "date":
                return <DatePicker {...commonProps} style={{ width: "100%" }} />;
            case "autocomplete":
                return (
                    <AutoComplete
                        {...commonProps}
                        options={field.options}
                        filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        {...(field.freeText ? {} : { onSelect: (value) => form.setFieldsValue({ [field.name]: value }) })}
                    >
                        {field.freeText && <Input />}
                    </AutoComplete>
                );
            case "list":
                return (
                    <Form.List name={field.name}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((listField) => (
                                    <Row key={listField.key} gutter={16} align="middle">
                                        {field.listFields?.map((subField) => (
                                            <Col span={subField.span || 24 / (field.listFields?.length || 1)} key={subField.name}>
                                                <Form.Item
                                                    {...listField}
                                                    label={subField.label}
                                                    name={[listField.name, subField.name]}
                                                    rules={subField.rules}
                                                >
                                                    {renderField(subField)}
                                                </Form.Item>
                                            </Col>
                                        ))}
                                        <Col>
                                            <MinusCircleOutlined onClick={() => remove(listField.name)} />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={field.addIcon || <PlusOutlined />}>
                                        {field.addText || `Add ${field.label}`}
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                );
            case "radiobutton":
                return (
                    <Radio.Group block optionType="button" className="d-flex" buttonStyle="solid">
                        {field.options?.map(({ value, label }) => (
                            <Radio.Button className="w-100 text-center" value={value} key={value}>
                                {label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                );
            default:
                return null;
        }
    };

    // New handleSubmit that includes password check logic
    const handleSubmit = async (values) => {
        try {
            // If password is required and the user is not authenticated, show the modal for validation
            if (isPasswordRequired && !isAuth) {
                const isValid = await onLogin("validate"); // Calls the validate method in AdminAuthContext

                if (!isValid) {
                    return; // Stop submission if the validation fails
                }
            }

            await form.validateFields();
            onSubmit(values);
            setIsSubmitting(true);
            form.resetFields();
            setCurrentStep(0);
        } catch (error) {
            console.error("Validation failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setCurrentStep(0);
        onCancel();
    };

    const next = async () => {
        try {
            if (steps) {
                const currentFields = steps[currentStep].fields.map((field) => field.name);
                await form.validateFields(currentFields);
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            console.error("Step validation failed:", error);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderFields = () => {
        const currentFields = steps ? steps[currentStep].fields : fields;
        let firstFieldRendered = false;

        return (
            <Row gutter={16}>
                {currentFields.map((field) => {
                    const isFirstField = !firstFieldRendered;
                    if (isFirstField) firstFieldRendered = true;

                    return (
                        <Col key={field.name} span={field.span || 24}>
                            <Form.Item name={field.name} label={field.label} rules={field.rules}>
                                {renderField(field, isFirstField)}
                            </Form.Item>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const renderSteps = () => {
        if (!steps) return null;
        return (
            <Steps current={currentStep}>
                {steps.map((step) => (
                    <Step key={step.title} title={step.title} />
                ))}
            </Steps>
        );
    };

    const renderButtons = () => {
        if (!steps) {
            return (
                <Space>
                    <Button onClick={handleCancel} disabled={isSubmitting}>
                        בטל
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
                        {isSubmitting ? "שומר..." : "שמור"}
                    </Button>
                </Space>
            );
        }

        const isLastStep = currentStep === steps.length - 1;
        return (
            <Space>
                <Button onClick={handleCancel} disabled={isSubmitting}>
                    בטל
                </Button>
                {currentStep > 0 && (
                    <Button onClick={prev} disabled={isSubmitting}>
                        הקודם
                    </Button>
                )}
                {isLastStep ? (
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        {isSubmitting ? "שומר..." : "שמור"}
                    </Button>
                ) : (
                    <Button type="primary" onClick={next} disabled={isSubmitting}>
                        הבא
                    </Button>
                )}
            </Space>
        );
    };

    return (
        <Modal title={title} open={visible} onCancel={handleCancel} footer={null} width={width}>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                {isLoading && <Loader />}
                {!isLoading && renderSteps()}
                {!isLoading && renderFields()}
                <Divider className="my-3 mt-2" />
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>{renderButtons()}</div>
            </Form>
        </Modal>
    );
};

// Add PropTypes
GenericForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["text", "number", "select", "checkbox", "date", "autocomplete", "list", "radiobutton"]).isRequired,
            label: PropTypes.string,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                    label: PropTypes.string.isRequired,
                }),
            ),
            rules: PropTypes.array,
            span: PropTypes.number,
            addText: PropTypes.string,
            addIcon: PropTypes.node,
            freeText: PropTypes.bool,
            listFields: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    label: PropTypes.string,
                    rules: PropTypes.array,
                    span: PropTypes.number,
                }),
            ),
        }),
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            fields: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    type: PropTypes.string.isRequired,
                    label: PropTypes.string,
                    rules: PropTypes.array,
                    span: PropTypes.number,
                }),
            ).isRequired,
        }),
    ),
    initialValues: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    isPasswordRequired: PropTypes.bool,
    width: PropTypes.any,
};

export default GenericForm;
