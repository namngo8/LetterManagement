const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agency = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    
});

const agencyModel = mongoose.model('Agency', agency);

module.exports = agencyModel;