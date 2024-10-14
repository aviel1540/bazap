import { useState, useEffect, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAdminAuth } from "../../../store/AdminAuthContext";
import CustomButton from "../../CustomButton/CustomButton";
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
import { convertInitialValuesToFormValues } from "./utils";
let timeoutId = null;

const { Step } = Steps;
const GenericForm = ({
    fields,
    onSubmit,
    title,
    visible,
    onCancel,
    steps,
    initialValues,
    isLoading,
    isPasswordRequired,
    zIndex = 1005,
    width = 800,
    isModal = true,
}) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuth, onLogin } = useAdminAuth();
    const fieldsRef = useRef({});
    const [disabledFields, setDisabledFields] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});
    useEffect(() => {
        if (visible && initialValues) {
            const formattedInitialValues = convertInitialValuesToFormValues(initialValues, fields);
            form.setFieldsValue(formattedInitialValues);
            setDefaultValues(formattedInitialValues);
        }
    }, [visible, initialValues, form, fields]);
    useEffect(() => {
        if (visible) {
            focusFirstField();
        }
    }, [visible]);
    const focusFirstField = () => {
        if (!isLoading && fields) {
            const firstField = fieldsRef?.current[fields[0]?.name];
            if (firstField && firstField.focus) {
                firstField.focus();
            }
        }
    };
    const handleClearErrors = () => {
        const fieldsWithErrors = form.getFieldsError();
        const fieldsWithoutErrors = fieldsWithErrors.map((field) => ({
            name: field.name,
            errors: [],
        }));
        form.setFields(fieldsWithoutErrors);
    };

    const fieldOnChangeHandler = (field, event, parentField) => {
        if (field?.onChange) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const data = {
                    value: event.target.value,
                    handleClearErrors,
                    setDisabledField,
                    field,
                    form,
                    parentField,
                };
                field.onChange(data);
            }, 300);
        }
    };

    const handleRemoveField = (fieldToRemove, fieldName, remove) => {
        remove(fieldToRemove);
        setDisabledField(fieldName, false, true);
    };

    const setNestedFieldRef = (fieldName, subFieldName, node) => {
        if (!fieldsRef.current[fieldName]) {
            fieldsRef.current[fieldName] = [];
        }
        if (!fieldsRef.current[fieldName][0]) {
            fieldsRef.current[fieldName][0] = {};
        }
        fieldsRef.current[fieldName][0][subFieldName] = node;
    };

    const renderField = (field, parentField = null) => {
        const fieldRef = (node) => {
            if (node) {
                if (parentField) {
                    setNestedFieldRef(parentField.name, field.name, node);
                } else {
                    fieldsRef.current[field.name] = node;
                }
            }
        };
        const fieldName = parentField ? parentField.name + "." + field.name : field.name;
        const isDisabled = disabledFields.includes(fieldName);
        switch (field.type) {
            case "text":
                return <Input ref={fieldRef} disabled={isDisabled} />;
            case "password":
                return <Input.Password ref={fieldRef} disabled={isDisabled} />;
            case "number":
                return <InputNumber className="w-100" disabled={isDisabled} ref={fieldRef} />;
            case "select":
                return (
                    <Select
                        disabled={isDisabled || field.disabled}
                        showSearch
                        allowClear
                        filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                        onChange={(value) => {
                            form.setFieldValue(field.name, value);
                            fieldOnChangeHandler(field, { target: { value }, parentField });
                        }}
                        ref={fieldRef}
                    >
                        {field.options?.map((option) => (
                            <Select.Option key={option.value} value={option.value} label={option.label}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case "checkbox":
                return (
                    <Checkbox ref={fieldRef} disabled={isDisabled}>
                        {field.label}
                    </Checkbox>
                );
            case "date":
                return <DatePicker ref={fieldRef} className="w-100" disabled={isDisabled} />;
            case "autocomplete":
                return (
                    <AutoComplete
                        allowClear={true}
                        disabled={isDisabled}
                        onChange={(value) => {
                            fieldOnChangeHandler(field, { target: { value } }, parentField);
                        }}
                        ref={fieldRef}
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
                        {(fields, { add, remove }) => {
                            const totalSpan = 23;
                            const availableSpan = totalSpan / (field.listFields?.length || 1);
                            return (
                                <>
                                    {fields.map((listField, index) => (
                                        <Row key={listField.key} gutter={16} align="middle">
                                            {field.listFields?.map((subField) => (
                                                <Col span={subField.span || Math.floor(availableSpan)} key={subField.name}>
                                                    <Form.Item
                                                        {...listField}
                                                        key={listField.key}
                                                        label={subField.label}
                                                        name={[listField.name, subField.name]}
                                                        rules={subField.rules}
                                                    >
                                                        {renderField(subField, { name: `${field.name}[${index}]` })}
                                                    </Form.Item>
                                                </Col>
                                            ))}
                                            <Col span={1}>
                                                <CustomButton
                                                    type="light-danger"
                                                    onClick={() =>
                                                        handleRemoveField(listField.name, `${fieldName}[${listField.name}]`, remove)
                                                    }
                                                    icon={<MinusCircleOutlined />}
                                                    block
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        {field.addButton == null ? (
                                            <Button type="dashed" onClick={() => add()} block icon={field.addIcon || <PlusOutlined />}>
                                                {field.addText || `Add ${field.label}`}
                                            </Button>
                                        ) : (
                                            field.addButton(add)
                                        )}
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form.List>
                );
            case "radiobutton":
                return (
                    <Radio.Group
                        size="large"
                        block
                        optionType="button"
                        onChange={(event) => fieldOnChangeHandler(field, event, parentField)}
                        className="d-flex"
                        buttonStyle="solid"
                        ref={fieldRef}
                    >
                        {field.options?.map(({ value, label }) => (
                            <Radio.Button className="w-100 text-center" value={value} key={value}>
                                {label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                );
            case "render":
                return <Fragment key={field.name}>{field.render({ renderFields, form, setDefaultValues })}</Fragment>;
            default:
                return null;
        }
    };

    const handleSubmit = async (values) => {
        try {
            await form.validateFields();
            if (isPasswordRequired && !isAuth) {
                const isValid = await onLogin("validate");

                if (!isValid) {
                    return;
                }
            }

            setIsSubmitting(true);
            const result = await onSubmit({ ...defaultValues, ...values });
            if (result) {
                form.resetFields();
                setCurrentStep(0);
            }
        } catch (error) {
            // onAlert(error.message, "error", true);
            console.log(error.message);
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

    const renderFields = (overrideFields) => {
        const currentFields = overrideFields || (steps ? steps[currentStep].fields : fields);
        return (
            <Row gutter={16} align="middle">
                {currentFields?.map((field) => {
                    const fieldSpan = field.span || 24;
                    const extraSpan = field.extra ? 24 - fieldSpan : 0;
                    return (
                        <Fragment key={field.name}>
                            <Col key={field.name} span={field.span || 24}>
                                <Form.Item name={field.name} label={field.label} rules={field.rules}>
                                    {renderField(field)}
                                </Form.Item>
                            </Col>
                            {field.extra && (
                                <Col key={`${field.name}-extra`} span={extraSpan}>
                                    {field.extra}
                                </Col>
                            )}
                        </Fragment>
                    );
                })}
            </Row>
        );
    };

    const renderSteps = () => {
        if (!steps) return null;
        return (
            <Steps current={currentStep} progressDot>
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
    const setDisabledField = (fieldName, isDisabled, isList = false) => {
        setDisabledFields((prevDisabledFields) => {
            if (isDisabled) {
                return [...prevDisabledFields, fieldName];
            } else {
                if (isList) {
                    return prevDisabledFields.filter((field) => !field.startsWith(fieldName));
                } else {
                    return prevDisabledFields.filter((field) => field !== fieldName);
                }
            }
        });
    };

    const formContent = (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            {renderSteps()}
            {renderFields()}
            <Divider className="my-3 mt-2" />
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>{renderButtons()}</div>
        </Form>
    );

    return (
        <>
            {isModal ? (
                <Modal
                    title={title}
                    zIndex={zIndex}
                    open={visible}
                    onCancel={handleCancel}
                    footer={null}
                    width={width}
                    afterOpenChange={(open) => {
                        if (open) focusFirstField();
                    }}
                >
                    {formContent}
                </Modal>
            ) : (
                formContent
            )}
        </>
    );
};

GenericForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf([
                "text",
                "password",
                "number",
                "select",
                "checkbox",
                "date",
                "autocomplete",
                "list",
                "radiobutton",
                "render",
            ]).isRequired,
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
    ),
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
    zIndex: PropTypes.number,
    width: PropTypes.any,
    isModal: PropTypes.bool,
};
GenericForm.displayName = "GenericForm";

export default GenericForm;
