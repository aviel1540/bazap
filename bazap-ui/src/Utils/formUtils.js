export const checkDuplicationInForm = (soruceArray, key, valueTofind, isEdit, id) => {
    const duplicate = soruceArray.find(
        (record) => record[key].toLowerCase().trim() === valueTofind.toLowerCase().trim() && (!isEdit || id !== record._id),
    );
    return duplicate != undefined;
};
