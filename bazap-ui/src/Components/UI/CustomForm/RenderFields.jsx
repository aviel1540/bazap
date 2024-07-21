import ControlledInput from "./ControlledInput";
import { Col, Row } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

const RenderFields = ({ stepFields, fieldArray = false, fieldKey }) => {
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
                                  return (
                                      <React.Fragment key={`${field.name}-${index}`}>
                                          <Col span={field.colSpan || 24}>
                                              <ControlledInput {...newField} control={control} />
                                          </Col>
                                          {field.extra && (
                                              <Col
                                                  key={`${field.name}_extra_${index}`}
                                                  span={field.extraSpan ? field.extraSpan : field.colSpan ? 24 - field.colSpan : 24}
                                              >
                                                  {field.extra}
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
};

export default RenderFields;
