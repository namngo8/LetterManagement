const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commune = new Schema({
    name: { type: String, required: true },
});

const district = new Schema({
    name: { type: String, required: true },
    communes: [commune]  
});

const province = new Schema({
    name: { type: String, required: true },
    districts: [district]
});

const provinceModel = mongoose.model('Province', province);

module.exports = provinceModel;