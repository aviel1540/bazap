import { checkDuplicationInForm } from "../../../../Utils/formUtils";

export const convertDeivcesToACOptions = (data) => {
    const uniqueDevices = [];
    if (data) {
        data.forEach((device) => {
            if (uniqueDevices.findIndex((d) => d.text === device.serialNumber) === -1) {
                uniqueDevices.push({ text: device.serialNumber });
            }
        });
    }
    return uniqueDevices;
};

export const onGetOptionLabel = (option) => {
    if (option.value != null) return option.text;
    if (typeof option === "string") {
        return option;
    }
    return option.text;
};

export const onFilterOptions = (options, params, isDeliveryVoucher, filter) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.text);
    if (!isDeliveryVoucher) {
        if (inputValue !== "" && !isExisting) {
            filtered.push({
                inputValue,
                text: `הוסף צ' "${inputValue}"`,
            });
        }
    }

    return filtered;
};

export const validateDuplicateSerialNumbersInFields = (value, formValues) => {
    const foundedDevices = formValues.devicesData.filter((device) => device.serialNumber === value);
    if (foundedDevices.length > 1) return "צ' מכשיר לא יכול להופיע פעמיים.";
    return true;
};

export const validateDuplicateSerialNumbersInDB = (value, allDevices) => {
    if (value) {
        const devices = allDevices.filter((device) => !device.voucherOut);
        if (checkDuplicationInForm(devices, "serialNumber", value, false, undefined)) {
            return "צ' כבר קיים באחד מהפרוייקטים.";
        }
    }
    return true;
};
