const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const autoNumberSchema = new Schema({
    voucherNumber: {
        type: Number,
    },
});

const AutoNumber = mongoose.model("AutoNumber", autoNumberSchema);
module.exports = AutoNumber;
