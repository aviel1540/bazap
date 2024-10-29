const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brigadeSchema = new Schema({
    brigadeName: {
        type: String,
        required: true,
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
    },
    unitsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Units",
        },
    ],
});

const Brigade = mongoose.model("Brigade", brigadeSchema);

module.exports = Brigade;
