const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        trim: true,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        default: null
    },
    finished: {
        type: Boolean,
        default: false
    },
    vouchersList : [{
        type: Schema.Types.ObjectId,
		ref: "Voucher",
    }]
});


const Project = mongoose.model('project', projectSchema);
module.exports = Project;