export const dateTostring = (inputString) => {
    const dateObject = new Date(inputString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
};
export const sortDevices = (deviceList) => {
    return deviceList.sort((a, b) => {
        if (a.unit.unitsName < b.unit.unitsName) return -1;
        if (a.unit.unitsName > b.unit.unitsName) return 1;
        if (a.status < b.status) return -1;
        if (a.status > b.status) return 1;
        // Sorting by serialNumber for classified devices or quantity if non-classified
        if (a.deviceTypeId.isClassified && b.deviceTypeId.isClassified) {
            return a.serialNumber.localeCompare(b.serialNumber);
        }
        // Assuming non-classified devices would have a 'quantity' field
        if (!a.deviceTypeId.isClassified && !b.deviceTypeId.isClassified) {
            return a.quantity - b.quantity;
        }
        return 0;
    });
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
    FINISHED: "הסתיים",
    FINISHED_OUT: "הסתיים - הוחזר ליחידה",
};

export const ALL = "הכל";
export const RETURNED = "הוחזר ליחידה";
export const FIXED_OR_DEFECTIVE = "תקין/מושבת";

export const tagColors = {
    "ממתין לעבודה": "default",
    בעבודה: "#2db7f5",
    תקין: "success",
    מושבת: "warning",
    "תקין - הוחזר ליחידה": "success",
    "מושבת - הוחזר ליחידה": "success",
};

export const ReturnedStatuses = [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN, DeviceStatuses.FINISHED_OUT];

export const sortOptions = (list, key) => {
    if (!list || !key) return [];

    const sortedList = [...list].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
    return sortedList;
};
