import ControlledInput from "./ControlledInput";
import { Col, Row } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

const RenderFields = ({ stepFields, fieldArray = false, fieldKey, disabledFields }) => {
    const { methods } = useFormContext();
    const { formMethods, localProps } = methods;
    const { fields } = localProps;
    const { control } = formMethods;
    const renderFields = fields ? fields : stepFields;

    return (
        <>
            {renderFields && (
                <Row gutter={[16, 12]} justify="space-around" align="middle">
                    {fieldArray
                        ? fieldArray.map((_, index) =>
                              renderFields.map((field) => {
                                  let newField = { ...field };
                                  newField.name = `${fieldKey}[${index}].${field.name}`;
                                  newField.index = index;
                                  newField.disabled = disabledFields && disabledFields[newField.name];
                                  let uniqueKey = uuidv4();
                                  return (
                                      <React.Fragment key={`${field.name}-${uniqueKey}`}>
                                          <Col span={field.colSpan || 24}>
                                              <ControlledInput {...newField} control={control} />
                                          </Col>
                                          {field.extra && (
                                              <Col
                                                  key={`${field.name}_extra_${uniqueKey}`}
                                                  span={field.extraSpan ? field.extraSpan : field.colSpan ? 24 - field.colSpan : 24}
                                              >
                                                  {field.extra}
                                              </Col>
                                          )}
                                          {field.extraRender && (
                                              <Col
                                                  key={`${field.name}_extraRender_${uniqueKey}`}
                                                  span={field.extraSpan ? field.extraSpan : field.colSpan ? 24 - field.colSpan : 24}
                                              >
                                                  {field.extraRender(index)}
                                              </Col>
                                          )}
                                      </React.Fragment>
                                  );
                              }),
                          )
                        : renderFields.map((field) => (
                              <React.Fragment key={field.name}>
                                  <Col span={field.colSpan || 24}>
                                      <ControlledInput {...field} control={control} />
                                  </Col>
                                  {field.extra && (
                                      <Col
                                          key={`${field.name}_extra`}
                                          span={field.extraSpan ? field.extraSpan : field.colSpan ? 24 - field.colSpan : 24}
                                      >
                                          {field.extra}
                                      </Col>
                                  )}
                              </React.Fragment>
                          ))}
                </Row>
            )}
        </>
    );
};

RenderFields.propTypes = {
    stepFields: PropTypes.array,
    fieldArray: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    fieldKey: PropTypes.string,
    disabledFields: PropTypes.array,
};

export default RenderFields;
