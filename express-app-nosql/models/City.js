const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const {addLastModifiedDate} = require('../helpers/models-hooks');

const citySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    capital: {
        type: Boolean,
        default: false
    },
    location: {
        lat: Number,
        long: Number
    }
}, {
    timestamps: true
});

citySchema.pre('save', addLastModifiedDate);
citySchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('City', citySchema);
