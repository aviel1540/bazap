import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const voucherAPI = axios.create({ baseURL: "http://localhost:5000/api/voucher" });
// const ExportAPI = axios.create({ baseURL: "http://localhost:5257/api" });
voucherAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllVouchers = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey;
    return await voucherAPI.get(`find-all-vouchers/${id}`);
};

export const getVoucherById = async (voucherId) => {
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

export const exportVoucherToExcel = async (voucherId) => {
    const voucher = await getVoucherById(voucherId);
    console.log(voucher);
    // type = true
    // get voucher by ID
    // convert to vou voucher format, send it
    // {
    //     "unit": {
    //         "_id": "65e7593aa16f0885a90c177c",
    //         "unitsName": "319",
    //         "__v": 0
    //     },
    //     "type": true,
    //     "receivedBy": "ניר",
    //     "arrivedBy": "ניר",
    //     "date": "2024-03-08T22:00:40.431Z",
    //     "place": null,
    //     "project": {
    //         "_id": "65e76d15a16f0885a90c17b8",
    //         "projectName": "מיפוי",
    //         "startDate": "2024-03-05T17:41:00.740Z",
    //         "endDate": null,
    //         "finished": false,
    //         "vouchersList": [
    //             "65ec3501f7148c55657a2c99",
    //             "660d9571eda37674758c31d5",
    //             "660d9591eda37674758c31f8",
    //             "660d9e8ceda37674758c3260"
    //         ],
    //         "__v": 4
    //     },
    //     "deviceList": [
    //         {
    //             "_id": "65ec3501f7148c55657a2ca1",
    //             "serialNumber": "234",
    //             "deviceType": "RPT",
    //             "unit": "65e7593aa16f0885a90c177c",
    //             "status": "תקין",
    //             "notes": null,
    //             "voucherNumber": "65ec3501f7148c55657a2c99",
    //             "project": "65e76d15a16f0885a90c17b8",
    //             "__v": 0
    //         }
    //     ],
    //     "__v": 1

    // const data = {
    //     project: "string",
    //     issuingUnit: "string",
    //     receivingUnit: "string",
    //     date: "2024-06-04T16:51:05.621Z",
    //     voucherNumber: "string",
    //     devices: [
    //         {
    //             serialNumber: "string",
    //             typeName: "string",
    //             typeId: "string",
    //         },
    //     ],
    //     issuingTechnician: "string",
    //     receivingTechnician: "string",
    // };

    // const response = await ExportAPI.post("/ExcelExport", data, {
    //     headers: {
    //         accept: "*/*",
    //         "Content-Type": "application/json",
    //     },
    //     responseType: "blob",
    // });
    // const blob = new Blob([response], { type: "application/octet-stream" });
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = "exported_file.xlsx"; //voucher name
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    // URL.revokeObjectURL(link.href);
};
