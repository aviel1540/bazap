import PropTypes from "prop-types";
import ControlledInput from "./ControlledInput";
import { Col, Row } from "antd";
import React from "react";

const RenderFields = ({ fields, control }) => {
    return (
        <Row gutter={[16, 12]} justify="space-around" align="middle">
            {fields.map((field) => {
                return (
                    <React.Fragment key={field.name}>
                        <Col key={field.name} span={field.colSpan || 24}>
                            <ControlledInput key={field.name} {...field} control={control} />
                        </Col>
                        {field.extra && (
                            <Col key={field.name} span={field.colSpan ? 24 - field.colSpan : 24}>
                                {field.extra}
                            </Col>
                        )}
                    </React.Fragment>
                );
            })}
        </Row>
    );
};

RenderFields.propTypes = {
    fields: PropTypes.array.isRequired,
    control: PropTypes.object.isRequired,
};
export default RenderFields;
