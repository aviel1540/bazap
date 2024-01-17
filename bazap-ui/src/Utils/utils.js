export const dateTostring = (inputString) => {
    const dateObject = new Date(inputString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
};

export const replaceApostropheInObject = (obj, keys) => {
    const targetKeys = Array.isArray(keys) ? keys : [keys];
    for (const key of targetKeys) {
        if (obj[key]) {
            obj[key] = replaceApostrophe(obj[key]);
        }
    }

    return obj;
};
export const replaceApostrophe = (value) => {
    return value.replace(/&#39;/g, "'");
};

export const DeviceStatuses = {
    WAIT_TO_WORK: "ממתין לעבודה",
    AT_WORK: "בעבודה",
    FIXED_RETURN: "תקין - הוחזר ליחידה",
    DEFECTIVE_RETURN: "מושבת - הוחזר ליחידה",
    FIXED: "תקין",
    DEFECTIVE: "מושבת",
};

const DeviceStatusesKeys = {
    "ממתין לעבודה": "WAIT_TO_WORK",
    בעבודה: "AT_WORK",
    "תקין - הוחזר ליחידה": "FIXED_RETURN",
    "מושבת - הוחזר ליחידה": "DEFECTIVE_RETURN",
    תקין: "FIXED",
    מושבת: "DEFECTIVE",
};

export const getDeviceStatusKey = (status) => {
    return DeviceStatusesKeys[status];
};
