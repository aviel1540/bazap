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
// Helper function to recursively process an object or array
export const processObjectOrArray = (obj) => {
    if (typeof obj === "string") {
        return replaceSpecialCharacters(obj);
    } else if (Array.isArray(obj)) {
        return obj.map((item) => processObjectOrArray(item));
    } else if (typeof obj === "object" && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = processObjectOrArray(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
};

export const replaceApostrophe = (value) => {
    if (value) return value.replace(/&#39;/g, "'");
    return value;
};

export const replaceSpecialCharacters = (value) => {
    if (value) {
        value = value.replace(/&quot;/g, '"');
        value = value.replace(/&#39;/g, "'");
    }
    return value;
};

export const DeviceStatuses = {
    WAIT_TO_WORK: "ממתין לעבודה",
    AT_WORK: "בעבודה",
    FIXED_RETURN: "תקין - הוחזר ליחידה",
    DEFECTIVE_RETURN: "מושבת - הוחזר ליחידה",
    FIXED: "תקין",
    DEFECTIVE: "מושבת",
};

export const ALL = "הכל";
export const RETURNED = "הוחזר ליחידה";
export const FIXED_OR_DEFFECTIVE = "תקין/מושבת";

export const tagColors = {
    "ממתין לעבודה": "default",
    בעבודה: "#2db7f5",
    תקין: "success",
    מושבת: "warning",
    "תקין - הוחזר ליחידה": "success",
    "מושבת - הוחזר ליחידה": "success",
};

export const addKeysToArray = (data, key, fromKey) => {
    if (!Array.isArray(data)) {
        throw new Error("First parameter must be an array");
    }
    if (!key) {
        throw new Error("Key parameter is required");
    }
    data.forEach((obj) => {
        obj[key] = obj[fromKey];
    });

    return data;
};
