import { Form, Button, Space, Flex, Divider } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import RenderFields from "./RenderFields";
import Loader from "../../Layout/Loader";
const CustomForm = ({
    defaultValues,
    initialValues,
    onSave,
    isEdit,
    onCancel,
    fields,
    isLoading,
    isFormIsLoading,
    extraButton,
    submitButtonText,
    onValuesChange,
    children,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (defaultValues) {
            form.setFieldsValue(defaultValues);
        }
    }, [defaultValues, form, isEdit]);

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };
    const handleSave = (data) => {
        onSave(data);
        form.resetFields();
    };
    return (
        <Form
            size="large"
            form={form}
            initialValues={initialValues}
            onValuesChange={onValuesChange}
            layout="vertical"
            onFinish={handleSave}
        >
            {isFormIsLoading && <Loader />}
            {!isFormIsLoading && <RenderFields fields={fields} />}
            {children}
            <Divider />
            <Form.Item>
                <Flex justify="flex-end" align="center">
                    <Space>
                        <Button onClick={handleCancel}>בטל</Button>
                        {extraButton}
                        {!isFormIsLoading && (
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                {submitButtonText ? submitButtonText : isEdit ? "עדכן" : "שמור"}
                            </Button>
                        )}
                    </Space>
                </Flex>
            </Form.Item>
        </Form>
    );
};

CustomForm.propTypes = {
    initialValues: PropTypes.object,
    defaultValues: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFormIsLoading: PropTypes.bool.isRequired,
    extraButton: PropTypes.node,
    submitButtonText: PropTypes.string,
    children: PropTypes.node,
    onValuesChange: PropTypes.func,
};

export default CustomForm;
