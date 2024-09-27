const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  division_name: {
    type: String,
    required: true
  },
  brigade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brigade',
    required: true
  }
});

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;