import axios from "axios";

const voucherAPI = axios.create({ baseURL: "http://localhost:5000/api/voucher" });

export const getAllVouchers = async ({ queryKey }) => {
    const [_, id] = queryKey;
    try {
        const response = await voucherAPI.get(`find-all-vouchers/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const addUnit = async (unit) => {
    try {
        return await voucherAPI.post("add-new-unit", unit);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteVoucher = async (voucherId) => {
    try {
        return await voucherAPI.delete(`delete/${voucherId}`);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const addVoucher = async (voucher) => {
    try {
        const { projectId } = voucher;
        return await voucherAPI.post(`/add-new-voucher/${projectId}`, voucher);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
