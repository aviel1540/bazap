const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceTypeSchema = new Schema({
    deviceName: {
        type: String,
        trim: true,
        required: true,
    },
    catalogNumber: {
        type: String,
        trim: true,
        required: true,
    },
    isClassified: {
        type: Boolean,
        default: false,
    },
});

const DeviceType = mongoose.model("DeviceType", deviceTypeSchema);
module.exports = DeviceType;
