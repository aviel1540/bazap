const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unitsSchema = new Schema({
    unitsName: {
        type: String,
        trim: true,
        required: true
    }
}); 


const UnitsType = mongoose.model('units', unitsSchema);
module.exports = UnitsType;