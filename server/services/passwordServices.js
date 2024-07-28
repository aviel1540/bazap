const Password = require("../models/Pass");

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

exports.login = async (id) => {
    return await Password.findOneAndUpdate(id, {
        lastAuthTime: new Date(),
    });
};

exports.logout = async (id) => {
    const date = new Date();
    const days = 5;
    var result = new Date(date);
    result.setDate(result.getDate() - days);

    return await Password.findOneAndUpdate(
        { type: false },
        {
            lastAuthTime: result,
        },
    );
};

exports.isAdminAuthenticated = async () => {
    const passwsord = await Password.findOne({ type: false });
    const currentTime = Date.now();
    const authTime = new Date(passwsord.lastAuthTime).getTime();
    const diffMinutes = (currentTime - authTime) / (1000 * 60);
    return diffMinutes <= 20;
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
