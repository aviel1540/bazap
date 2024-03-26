import { useState } from "react";
import Loader from "../../../../Layout/Loader";
import { AutoComplete, Button, Flex, Form, Select } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { getDeviceBySerialNumber, getDevices } from "../../../../../Utils/deviceApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { rulesValidations } from "../../../../../Utils/formUtils";
import { getAllDeviceTypes } from "../../../../../Utils/deviceTypeApi";
import { replaceApostrophe } from "../../../../../Utils/utils";

const getAutoCompleteOptions = (devices) => {
    return devices.map((item) => ({ value: item.serialNumber, key: item._id.toString() }));
};

const Step2 = ({ form }) => {
    const { onAlert, error } = useUserAlert();
    const [options, setOptions] = useState([]);
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
        onSuccess: (data) => {
            setOptions(getAutoCompleteOptions(data));
        },
    });

    const { isLoading: isLoadingDevicesTypes, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: async () => {
            const deviceTypesData = await getAllDeviceTypes();
            const newArray = deviceTypesData.map((dType) => {
                const formattedName = replaceApostrophe(dType.deviceName);
                return { text: formattedName, value: formattedName, ...dType };
            });
            return newArray;
        },
    });

    const isLoading = isLoadingArrivedDevices || isLoadingDevicesTypes;
    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const handleSearch = (value) => {
        let filteredOptions;
        if (value) {
            filteredOptions = getAutoCompleteOptions(allDevices.filter((item) => item.serialNumber.includes(value)));

            const exactMatch = allDevices.some((item) => item.serialNumber === value);
            if (!exactMatch) {
                filteredOptions.push({ value, key: value });
            }
        } else {
            filteredOptions = getAutoCompleteOptions(allDevices);
        }
        setOptions(filteredOptions);
    };
    const handleSelect = async (value) => {
        setOptions(getAutoCompleteOptions(allDevices));
        if (value) {
            try {
                // Fetch device details by serial number
                const deviceDetails = await getDeviceBySerialNumberMutation.mutateAsync(value);
                const devices = form.getFieldsValue().devices;

                const deviceIndex = devices.findIndex((device) => device.serialNumber === value);

                if (deviceIndex !== -1) {
                    const updatedDevices = [...devices]; // Create a copy of the devices array to avoid mutating the original state
                    updatedDevices[deviceIndex] = {
                        ...updatedDevices[deviceIndex], // Copy the existing device object
                        deviceType: deviceDetails.deviceType, // Update the deviceType property with the new value
                    };

                    // Now, update the devices array in the form
                    form.setFieldsValue({
                        devices: updatedDevices,
                    });
                }
            } catch (error) {
                console.error("Error fetching device details:", error);
            }
        }
    };
    return (
        <>
            {isLoading && <Loader />}
            <Box marginBottom="20px">
            <ImportExcel form={form} /> 
            </Box>
            <Form.Item noStyle label="מכשירים">
                <Form.List name="devices">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Flex key={key} gap="middle" justify="center" align="center">
                                    <Form.Item
                                        style={{
                                            width: "60%",
                                        }}
                                        {...restField}
                                        name={[name, "serialNumber"]}
                                        rules={[rulesValidations.required, rulesValidations.minLengthSerialNumber]}
                                    >
                                        <AutoComplete
                                            placeholder="הקלד צ' מכשיר"
                                            onSearch={handleSearch}
                                            onSelect={handleSelect}
                                            options={options}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "40%" }}
                                        {...restField}
                                        name={[name, "deviceType"]}
                                        rules={[rulesValidations.required]}
                                    >
                                        <Select placeholder="בחר סוג מוצר" options={deviceTypes} />
                                    </Form.Item>
                                    <Button
                                        disabled={index == 0}
                                        onClick={() => {
                                            remove(name);
                                        }}
                                        shape="circle"
                                        icon={<CloseOutlined />}
                                    />
                                </Flex>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                {/* <Form.List name="devices">
                    {(fields, listOpt) => (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 16,
                            }}
                        >
                            {fields.map((field, index) => (
                                <Flex key={field.name} gap="middle" justify="center" align="center">
                                    <Form.Item label={index === 0 ? "Devices" : ""} required={false} key={field.key}>
                                        <Form.Item
                                            name={[field.name, "serialNumber"]}
                                            validateTrigger={["onChange", "onBlur"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Please input device's serial number or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <AutoComplete
                                                placeholder="Serial Number"
                                                style={{
                                                    width: "60%",
                                                }}
                                                options={options} // replace options with your actual options
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, "deviceType"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select device type",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Select
                                                placeholder="Device Type"
                                                style={{
                                                    width: "60%",
                                                }}
                                            >
                                                {deviceTypes.map((type) => (
                                                    <Option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => listOpt.remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                    ))
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => listOpt.add()}
                                            style={{
                                                width: "60%",
                                            }}
                                            icon={<PlusOutlined />}
                                        >
                                            Add Device
                                        </Button>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                listOpt.add("The head item", 0);
                                            }}
                                            style={{
                                                width: "60%",
                                                marginTop: "20px",
                                            }}
                                            icon={<PlusOutlined />}
                                        >
                                            Add Device at Head
                                        </Button>
                                    </Form.Item>
                                </Flex>
                            ))}
                            <Button type="dashed" onClick={() => listOpt.add()} block>
                                הוסף מכשיר
                            </Button>
                        </div>
                    )}
                </Form.List> */}
            </Form.Item>
        </>
    );
};

import PropTypes from "prop-types";
import { useUserAlert } from "../../../../store/UserAlertContext";
import ImportExcel from "../NewVoucher/ImportExcel";
import { Box } from "@mui/material";

Step2.propTypes = {
    form: PropTypes.object,
};
export default Step2;
