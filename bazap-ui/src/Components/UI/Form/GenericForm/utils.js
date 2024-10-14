import dayjs from "dayjs";

export const convertInitialValuesToFormValues = (values, fields) => {
    return Object.keys(values).reduce((acc, key) => {
        if (fields.find((field) => field.name === key && field.type === "date")) {
            acc[key] = dayjs(values[key]);
        } else {
            acc[key] = values[key];
        }
        return acc;
    }, {});
};
