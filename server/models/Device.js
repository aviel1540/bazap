const mongoose = require("mongoose");
const { DeviceStatus } = require("../constants/DeviceStatus");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    serialNumber: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    place: {
        type: String,
        enum: [DeviceStatus.WAIT_TO_WORK, DeviceStatus.AT_WORK, DeviceStatus.FINISHED,DeviceStatus.RETURNED],
        default: DeviceStatus.WAIT_TO_WORK
    },
    status: {
        type: String,
        enum: [DeviceStatus.FIXED, DeviceStatus.DEFECTIVE],
    },
    arrivedDate: {
        type: Date,
        default: Date.now()
    },
    startDate: {
        type: Date,
        // default: null
    },
    endDate: {
        type : Date,
        // default: null
    },
    returnDate: {
        type : Date,
        // default: null
    },
    fixedBy: {
        type: String,
        trim: true,
        // default: null
    },
    changeDate: {
        type: Date,
        // default: null
    },
    notes: {
        type: String,
        trim: true,
        // default: null
    }

});

const Device = mongoose.model('device', deviceSchema);
module.exports = Device;