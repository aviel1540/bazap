const Password = require('../models/Password')


exports.findSuperPassByValue = async(superPassValue) => {
    
}




exports.updateAdminPass = async(request) => {
    const {checkAdminPassword, checkNewPassword} = request;
    return await Password.findOneAndUpdate(checkAdminPassword, {
        pass_value: checkNewPassword
    })
}

exports.findAdminPassword = async(adminPass) => {
    return await Password.findOne({pass_value : adminPass})

}

exports.findMasterPassword = async(masterPass) => {
    return await Password.findOne({pass_value : masterPass})

}