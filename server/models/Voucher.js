const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    voucherNumber: {
        type: Number,
        trim: true,
        default: 0
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: "Units"
    },
    // voucher in or out
    type: {
        type: Boolean,
        trim: true,
        default: null
    },
    recievedBy: {
        type: Schema.Types.ObjectId,
        ref: "Technician"
    },
    arrivedBy: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    deviceList: [{
        type: Schema.Types.ObjectId,
        ref: "Device"
    }]

});

const Voucher = mongoose.model('voucher', voucherSchema);
module.exports = Voucher;