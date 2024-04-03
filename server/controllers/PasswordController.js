const escape = require("escape-html");
const validation = require("../utils/validation");
const passwordService = require("../services/passwordServices");


exports.getAdminPassword = async (req, res) => {

}

exports.updateAdminPassword = async (req, res) => {
    const masterPass = escape(req.body.masterPass);
    const oldAdminPass = escape(req.body.oldPassword);
    const newPassword = escape(req.body.newPassword);
    let password;
    let newAdminPassword;
    try {
        if (!masterPass) {
            return res.status(401).json({ message: "יש להזין סיסמת מאסטר !" });
        }
        if (![oldAdminPass, newPassword].every(Boolean)) {
            throw new Error('יש למלא את כל השדות');
        }
        const checkMasterPass = validation.addSlashes(masterPass);
        const masterPassword = await passwordService.findMasterPassword(checkMasterPass);
        if(!masterPassword || !password.type) {
            return res.status(401).json({ message: "סיסמא שגויה !" });
        }
        const checkNewPassword = validation.addSlashes(newPassword);
        const checkAdminPassword = validation.addSlashes(oldAdminPass);
        password = await passwordService.findAdminPassword(checkAdminPassword);
        if (!password || password.type) {
            return res.status(401).json({ message: "סיסמא שגויה !" })
        }
        newAdminPassword = await passwordService.updateAdminPass({
            checkAdminPassword,
            checkNewPassword
        })
        await newAdminPassword.save();
        return res.status(200).json(true)
    } catch (err) {
        return res.status(500).json(err.message)
    }
}

exports.validatePassword = async (req, res) => {
    const adminPass = escape(req.body.password);
    let password;
    try {
        if (!adminPass) {
            return res.status(401).json({ message: "יש להזין סיסמת מנהל" });
        }
        const checkAdminPassword = validation.addSlashes(adminPass);
        password = await passwordService.findAdminPassword(checkAdminPassword);
        if (!password || password.type) {
            return res.status(401).json({ message: "סיסמא שגויה !" })
        }
        return res.status(200).json(true)

    } catch (err) {
        return res.status(500).json(err.message)
    }
}