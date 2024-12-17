const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: { type: String },
    contentType: { type: String },
    file: { type: Buffer },
    fileUrl: { type: String },
    uploadDate: { type: Date, default: Date.now },
});

const lt_letter = new Schema({
    gov_agency: { type: String, required: true },
    letter_no: { type: String, required: true },
    source: { type: Number, required: true },
    receive_at: { type: Date, required: true },
    sender_type: { type: Number, required: true },
    sender: [{
        quantity: { type: Number },
        owner: { type: String },
        organ: { type: String },
        position: { type: String },
        Id_card: { type: String },
        Id_card_created_at: { type: Date },
        Id_card_created_in: { type: String },
        gender: {type:Number},
        ethnic: { type: Number },
        nationality: { type: String },
        address:[{
            province: { type: String },
            district: { type: String },
            commune: { type: String },
            specified_address: { type: String },
        }],
    }],
    is_eligible: { type: Boolean },
    times_case: { type: Number },
    pre_status: { type: Number },
    case: { type: String },
    status: { type:Number },
    file:{
        type:[fileSchema],
    },
});

const letterModel = mongoose.model('Lt_Letter', lt_letter);

module.exports = letterModel;