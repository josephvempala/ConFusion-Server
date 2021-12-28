const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    telnum: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        required: true
    },
    contactType: {
        type: String,
        default: true
    },
    message: {
        type: String,
        default: true
    }
}, {
    timestamps: true
});

const Feedbacks = mongoose.model('feedback', FeedbackSchema);
module.exports = Feedbacks;