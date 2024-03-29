import axios from "axios";
import { replaceApostropheInObject } from "./utils";

const unitAPI = axios.create({ baseURL: "http://localhost:5000/api/units" });

export const getAllUnits = async () => {
    const response = await unitAPI.get("");
    return response.data;
};

export const addUnit = async (unit) => {
    try {
        unit = replaceApostropheInObject(unit, "unitsName");
        return await unitAPI.post("add-new-unit", unit);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteUnit = async (deleteUnit) => {
    try {
        return await unitAPI.delete(`delete/${deleteUnit}`);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const updateUnit = async (unit) => {
    try {
        const { id } = unit;
        return await unitAPI.patch(`/update-unit/${id}`, unit);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
