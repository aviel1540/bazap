// voucherModel.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    voucherNumber: {
        type: String,
        trim: true,
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: "Units",
        required : true
    },
    type: {
        type: Boolean,
        trim: true,
        default: null,
    },
    receivedBy: {
        type: String,
        trim: true,
        required: true,
    },
    arrivedBy: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    place: {
        type: Boolean,
        default: null,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
    deviceList: [
        {
            type: Schema.Types.ObjectId,
            ref: "Device",
        },
    ],
    accessoriesList: [
        {
            type: Schema.Types.ObjectId,
            ref: "Accessories",
        },
    ],
});
const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;
