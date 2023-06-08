const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        trim: true,
        required: true
    },
    unit: {
        type: String,
        trim: true,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    categoriesList: {
        type: Schema.Types.ObjectId,
		ref: "Device",
    }
});


const Project = mongoose.model('project', projectSchema);
module.exports = Project;