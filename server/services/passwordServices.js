const Password = require("../models/password");

exports.showAdminPass = async () => {
    return await Password.findOne({ type: false });
};

exports.updateAdminPass = async (request) => {
    const { checkAdminPassword, checkNewPassword } = request;
    return await Password.findOneAndUpdate(checkAdminPassword, {
        pass_value: checkNewPassword,
    });
};

exports.findPasswordByValue = async (pass) => {
    return await Password.findOne({ pass_value: pass });
};

exports.findMasterPassword = async (masterPass) => {
    return await Password.findOne({ pass_value: masterPass });
};

exports.checkPasswordsExistence = async () => {
    const adminPassword = await Password.findOne({ type: false });
    const masterPassword = await Password.findOne({ type: true });

    if (!adminPassword) {
        // Create admin password if it doesn't exist
        await Password.create({ type: false, pass_value: "DEFAULT_ADMIN_PASSWORD" });
    }

    if (!masterPassword) {
        // Create master password if it doesn't exist
        await Password.create({ type: true, pass_value: "DEFAULT_MASTER_PASSWORD" });
    }
};
