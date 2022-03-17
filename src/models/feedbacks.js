const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
    {
        firstname: {
            type: String,
            minLength: 2,
            maxLength: 15,
            required: true,
        },
        lastname: {
            type: String,
            minLength: 2,
            maxLength: 15,
            required: false,
        },
        telnum: {
            type: Number,
            min: 0,
            max: 9999999999,
            required: true,
        },
        email: {
            type: String,
            validate: (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val),
            required: true,
        },
        agree: {
            type: Boolean,
            required: true,
        },
        contactType: {
            type: String,
            default: true,
        },
        message: {
            type: String,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const Feedbacks = mongoose.model('feedback', FeedbackSchema);
module.exports = Feedbacks;
