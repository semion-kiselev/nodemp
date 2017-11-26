const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const productSchema = new Schema({
    name: {
        type: String,
        required: 'Please, supply a name',
        trim: true
    },
    brand: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    reviewers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'Please, supply a reviewer!'
    }],
    lastModifiedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

productSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Product', productSchema);
