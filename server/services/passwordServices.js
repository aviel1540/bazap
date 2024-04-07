const Password = require('../models/Password')


exports.showAdminPass = async() => {
    return await Password.findOne({ type: false});
}

exports.updateAdminPass = async(request) => {
    const {checkAdminPassword, checkNewPassword} = request;
    return await Password.findOneAndUpdate(checkAdminPassword, {
        pass_value: checkNewPassword
    })
}

exports.findPasswordByValue = async(pass) => {
    return await Password.findOne({pass_value : pass})

}

exports.findMasterPassword = async(masterPass) => {
    return await Password.findOne({pass_value : masterPass})

}