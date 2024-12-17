const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lt_case = new Schema({
    case_type: {
        type: Number,
    },
    field: {
        type: Number,
    },
    content: {
        type: String,
    },
});

const caseModel = mongoose.model('Lt_Case', lt_case);

module.exports = caseModel;