import { FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Tooltip, Upload, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import readXlsxFile from "read-excel-file";
import { getDeviceBySerialNumber } from "../../../../Utils/deviceApi";
import { downloadTemplateFile, readDevicesExcelFile } from "../../../../Utils/excelUtils";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";

const ImportExcel = ({ remove, append, setDisabledFields, getValues, isDeliveryVoucher, setSelectedRowKeys }) => {
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const [loading, setLoading] = useState(isLoading);
    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {});

    const config = {
        name: "file",
        showUploadList: false,
        maxCount: 1,
        beforeUpload(file) {
            setLoading(true);
            const isExcelFile = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (!isExcelFile) {
                message.error("Please upload an Excel file (.xlsx)");
                setLoading(false);
                return;
            }
            setLoading(false);
            readXlsxFile(file)
                .then(async (rows) => {
                    const excelDevices = readDevicesExcelFile(rows);
                    if (!isDeliveryVoucher) {
                        const firstDevice = getValues().devices[0];
                        if (firstDevice.serialNumber == "" && firstDevice.deviceType == "") {
                            remove(0);
                        }
                        const allDevices = getValues().devices;
                        let addedIndex = allDevices.length;
                        const indexes = [];
                        for (let i = 0; i < excelDevices.length; i++) {
                            const device = excelDevices[i];
                            const deviceFromDb = await getDeviceBySerialNumberMutation.mutateAsync(device.serialNumber);
                            let deviceType = device.deviceType; // device type from excel
                            if (deviceFromDb.message != null) {
                                if (!deviceFromDb.message) {
                                    if (allDevices.findIndex((dev) => dev.serialNumber == device.serialNumber) == -1) {
                                        append({
                                            serialNumber: device.serialNumber,
                                            deviceType: device.deviceTypeId._id,
                                        });
                                        if (deviceType) {
                                            indexes.push(addedIndex);
                                            addedIndex++;
                                        }
                                    }
                                }
                            } else {
                                let deviceTypeId = undefined;
                                // check if device type exist
                                if (deviceType) {
                                    let deviceTypeObj = deviceTypes.find((deviceType) => deviceType._id === deviceType);
                                    deviceTypeId = deviceTypeObj?._id;
                                }
                                append({
                                    serialNumber: device.serialNumber,
                                    deviceType: deviceTypeId,
                                });
                            }
                        }
                        setDisabledFields((prev) => {
                            const newState = { ...prev };
                            indexes.forEach((index) => {
                                newState[index] = true;
                            });
                            return newState;
                        });
                    } else {
                        const notFoundDevices = [];
                        const foundedDevicesIds = [];
                        const promises = excelDevices.map(async (device) => {
                            const deviceFromDb = await getDeviceBySerialNumberMutation.mutateAsync(device.serialNumber);
                            if (!deviceFromDb.message) {
                                foundedDevicesIds.add(deviceFromDb._id);
                            } else {
                                notFoundDevices.push(device.serialNumber);
                            }
                        });

                        await Promise.all(promises);

                        const uniqueIds = Array.from(foundedDevicesIds);

                        setSelectedRowKeys((prevState) => {
                            const newIds = uniqueIds.filter((id) => !prevState.includes(id));
                            return [...prevState, ...newIds];
                        });

                        if (notFoundDevices.length > 0) {
                            message.info("מכשירים עם הצ': " + notFoundDevices.join(", ") + " לא נמצאו ברשימת המכשירים הזמינים לניפוק");
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error reading file:", error);
                    message.error("Error reading file");
                });
            return false;
        },
        onChange(info) {
            const { file } = info;

            if (info.file.status === "uploading") {
                setLoading(true);
                return;
            }
            if (file.status === "done") {
                setLoading(false);
            } else if (file.status === "error") {
                setLoading(false);
                message.error("File upload failed");
            }
        },
    };
    return (
        <>
            <Flex justify="flex-end" gap="middle" align="flex-start">
                <Upload {...config}>
                    <Tooltip placement="top" title="העלה קובץ אקסל" arrow={true}>
                        <Button type="primary" loading={loading} icon={<ImportOutlined />}></Button>
                    </Tooltip>
                </Upload>
                <Tooltip placement="top" title="הורד קובץ לדוגמא" arrow={true}>
                    <Button icon={<FileExcelOutlined />} style={{ color: "green" }} onClick={downloadTemplateFile}></Button>
                </Tooltip>
            </Flex>
        </>
    );
};

ImportExcel.propTypes = {
    remove: PropTypes.func,
    append: PropTypes.func,
    setDisabledFields: PropTypes.func,
    getValues: PropTypes.func,
    isDeliveryVoucher: PropTypes.bool,
    setSelectedRowKeys: PropTypes.func,
};
export default ImportExcel;
