const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    type: {
        type: Boolean, //true - super , false - admin
    },
    pass_value: {
        type: String,
        trim: true,
    },
});

const Password = mongoose.model("Password", passwordSchema);
module.exports = Password;
