import PropTypes from "prop-types";
import { Button, Upload, message } from "antd";
import { downloadTemplateFile, readDevicesExcelFile } from "../../../../../Utils/excelUtils";
import { useMutation } from "@tanstack/react-query";
import { getDeviceBySerialNumber } from "../../../../../Utils/deviceApi";
import { useUserAlert } from "../../../../store/UserAlertContext";
import readXlsxFile from "read-excel-file";
import { UploadOutlined } from "@ant-design/icons";

const ImportExcel = ({ fields, remove, append }) => {
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
        maxCount: 1,
        onChange(info) {
            const { file } = info;

            if (file.status === "done") {
                readXlsxFile(file.originFileObj)
                    .then((rows) => {
                        const excelDevices = readDevicesExcelFile(rows);
                        excelDevices.forEach(async (device) => {
                            const data = await getDeviceBySerialNumberMutation.mutateAsync(device.serialNumber);
                            if (!data.message) {
                                if (fields[0].serialNumber == "" && fields[0].deviceType == "") {
                                    remove(0);
                                }
                                append({
                                    serialNumber: device.serialNumber,
                                    deviceType: data.deviceType == device.deviceType ? device.deviceType : "",
                                });
                            } else {
                                append({
                                    serialNumber: device.serialNumber,
                                    deviceType: device.deviceType,
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        // Handle errors
                        console.error("Error reading file:", error);
                        message.error("Error reading file");
                    });
            } else if (file.status === "error") {
                // Handle file upload error
                message.error("File upload failed");
            }
        },
    };
    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>ייבא מאקסל</Button>
            </Upload>
            <Button onClick={downloadTemplateFile}>הורד דוגמא</Button>
        </>
    );
};

ImportExcel.propTypes = {
    fields: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    append: PropTypes.func.isRequired,
};
export default ImportExcel;
