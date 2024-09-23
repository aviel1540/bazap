const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brigadeSchema = new Schema({
  unit_name: {
    type: String,
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  }
});

const Brigade = mongoose.model('Brigade', brigadeSchema);

module.exports = Brigade;