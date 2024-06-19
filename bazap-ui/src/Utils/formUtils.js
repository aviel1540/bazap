export const checkDuplicationInForm = (soruceArray, key, valueTofind, isEdit, id) => {
    const duplicate = soruceArray.find(
        (record) => record[key]?.toLowerCase().trim() === valueTofind.toLowerCase().trim() && (!isEdit || id !== record._id),
    );
    return duplicate != undefined;
};

export const rulesValidations = {
    required: {
        required: true,
        message: "יש למלא שדה זה.",
    },
    minLength: {
        min: 2,
        message: "שדה זה חייב לפחות 2 תווים",
    },
    minLengthSerialNumber: {
        min: 6,
        message: "מספר צ' קצר מדי",
    },
};
