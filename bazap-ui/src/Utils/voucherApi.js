import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const BAZAP = "גדוד 388";
const VOCUHER_URL = import.meta.env.VITE_VOUCHER_DOTNET_URL;
const be_URL = import.meta.env.VITE_BE_API_URL;

const voucherAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/voucher` });
const ExportAPI = axios.create({ baseURL: `http://${VOCUHER_URL}:5257/api` });
voucherAPI.interceptors.response.use(responseHandle, errorHandle);
// ExportAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllVouchers = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey;
    return await voucherAPI.get(`find-all-vouchers/${id}`);
};

export const getVoucherById = async ({ queryKey }) => {
    const [_, voucherId] = queryKey;
    return await voucherAPI.get(`/${voucherId}`);
};
export const deleteVoucher = async (voucherId) => {
    return await voucherAPI.delete(`delete/${voucherId}`);
};

export const addVoucherIn = async (voucher) => {
    const { projectId } = voucher;
    return await voucherAPI.post(`/add-new-voucher-in/${projectId}`, voucher);
};

export const addVoucherOut = async (voucher) => {
    const { projectId } = voucher;
    return await voucherAPI.post(`add-new-voucher-out/${projectId}`, voucher);
};

export const changeVoucherProject = async (voucherId, projectId) => {
    return await voucherAPI.patch(`/change-voucher-project/${voucherId}/${projectId}`);
};

export const exportVoucherToExcel = async (voucherId) => {
    const voucher = await getVoucherById(["", voucherId]);
    const devices = [];
    voucher.deviceList.forEach((device) => {
        devices.push({
            serialNumber: device.serialNumber,
            deviceType: device.deviceTypeId.deviceName,
            catalogNumber: device.deviceTypeId.catalogNumber,
            notes: device.notes,
            quantity: "1",
        });
    });
    voucher.accessoriesList.forEach((accessory) => {
        devices.push({
            serialNumber: "",
            deviceType: accessory.deviceTypeId.deviceName,
            catalogNumber: accessory.deviceTypeId.catalogNumber,
            notes: `${accessory.notes ? accessory.notes + " |" : ""} תקין - ${accessory.fix} | מושבת - ${accessory.defective}`,
            quantity: accessory.quantity.toString(),
        });
    });
    // voucher.
    const formattedVoucher = {
        project: voucher.project.projectName,
        receivingUnit: voucher.type ? BAZAP : voucher.unit.unitsName,
        issuingUnit: voucher.type ? voucher.unit.unitsName : BAZAP,
        date: voucher.date,
        voucherNumber: voucher.voucherNumber,
        devices: devices,
        issuingTechnician: voucher.arrivedBy,
        receivingTechnician: voucher.receivedBy,
    };
    try {
        const response = await ExportAPI.post("/ExcelExport", formattedVoucher, {
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            responseType: "blob",
        });

        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        let fileName = `שובר_${voucher.voucherNumber}_${voucher.project.projectName}_${voucher.type ? "קבלה" : "ניפוק"}.xlsx`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.log(error);
    }
};
