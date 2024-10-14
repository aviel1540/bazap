const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unitsSchema = new Schema({
    unitsName: {
        type: String,
        trim: true,
        required: true,
    },
    brigade: {
        type: Schema.Types.ObjectId,
        ref: "Brigade",
    },
});

const UnitsType = mongoose.model("Units", unitsSchema);
module.exports = UnitsType;
