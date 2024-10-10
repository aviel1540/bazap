const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brigadeSchema = new Schema({
  brigadeName: {
    type: String,
    required: true
  },
  unitsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  }]
});

const Brigade = mongoose.model('Brigade', brigadeSchema);

module.exports = Brigade;