import PropTypes from "prop-types";
import { Button, Flex, Tooltip, Upload, message } from "antd";
import { downloadTemplateFile, readDevicesExcelFile } from "../../../../../Utils/excelUtils";
import { useMutation } from "@tanstack/react-query";
import { getDeviceBySerialNumber } from "../../../../../Utils/deviceApi";
import { useUserAlert } from "../../../../store/UserAlertContext";
import readXlsxFile from "read-excel-file";
import { FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import { useState } from "react";
import { replaceApostrophe } from "../../../../../Utils/utils";

const ImportExcel = ({ remove, append, setDisabledFields, getValues }) => {
    const [loading, setLoading] = useState(false);

    const { onAlert, error } = useUserAlert();
    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });

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
                .then((rows) => {
                    const excelDevices = readDevicesExcelFile(rows);
                    const firstDevice = getValues().devices[0];
                    if (firstDevice.serialNumber == "" && firstDevice.deviceType == "") {
                        remove(0);
                    }
                    const allDevices = getValues().devices;
                    let addedIndex = allDevices.length;
                    excelDevices.forEach(async (device) => {
                        const deviceFromDb = await getDeviceBySerialNumberMutation.mutateAsync(device.serialNumber);
                        let deviceType = device.deviceType;
                        if (!deviceFromDb.message) {
                            deviceType = replaceApostrophe(deviceFromDb.deviceType);
                        }
                        if (allDevices.findIndex((dev) => dev.serialNumber == device.serialNumber) == -1) {
                            append({
                                serialNumber: device.serialNumber,
                                deviceType: deviceType,
                            });
                            if (deviceType) {
                                setDisabledFields((prev) => {
                                    const newState = prev;
                                    newState[addedIndex] = true;
                                    addedIndex++;
                                    return newState;
                                });
                            }
                        }
                    });
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
                console.log("uploaded");
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
};
export default ImportExcel;
