const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const techSchema = new Schema({
techName: {
        type: String,
        trim: true,
        required: true,
    },
});

const Technician = mongoose.model("Technician", techSchema);
module.exports = Technician;
