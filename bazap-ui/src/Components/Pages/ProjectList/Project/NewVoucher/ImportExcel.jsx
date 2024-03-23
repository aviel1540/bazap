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

const ImportExcel = ({ fields, remove, append }) => {
    const [loading, setLoading] = useState(false);

    const { onAlert, error } = useUserAlert();
    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const props = {
        name: "file",
        action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
        headers: {
            authorization: "authorization-text",
        },
        showUploadList: false,

        maxCount: 1,
        onChange(info) {
            const { file } = info;
            if (info.file.status === "uploading") {
                setLoading(true);
                return;
            }
            if (file.status === "done") {
                setLoading(false);
                readXlsxFile(file.originFileObj)
                    .then((rows) => {
                        const excelDevices = readDevicesExcelFile(rows);
                        if (fields[0].serialNumber == "" && fields[0].deviceType == "") {
                            remove(0);
                        }
                        excelDevices.forEach(async (device) => {
                            const data = await getDeviceBySerialNumberMutation.mutateAsync(device.serialNumber);
                            let deviceType = device.deviceType;
                            if (!data.message) {
                                if (device.deviceType == null) {
                                    deviceType = replaceApostrophe(data.deviceType);
                                } else if (data.deviceType != device.deviceType) {
                                    deviceType = "";
                                }
                            }
                            if (fields.findIndex((dev) => dev.serialNumber == device.serialNumber) == -1) {
                                append({
                                    serialNumber: device.serialNumber,
                                    deviceType: deviceType,
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("Error reading file:", error);
                        message.error("Error reading file");
                    });
            } else if (file.status === "error") {
                message.error("File upload failed");
            }
        },
    };
    return (
        <>
            <Flex justify="flex-end" gap="middle" align="flex-start">
                <Tooltip placement="top" title="העלה קובץ אקסל" arrow={true}>
                    <Upload {...props}>
                        <Button type="primary" loading={loading} icon={<ImportOutlined />}></Button>
                    </Upload>
                </Tooltip>
                <Tooltip placement="top" title="הורד קובץ לדוגמא" arrow={true}>
                    <Button icon={<FileExcelOutlined />} style={{ color: "green" }} onClick={downloadTemplateFile}></Button>
                </Tooltip>
            </Flex>
        </>
    );
};

ImportExcel.propTypes = {
    fields: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    append: PropTypes.func.isRequired,
};
export default ImportExcel;
