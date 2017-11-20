const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please, supply an email address'
    },
    username: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.virtual('password')
    .set(function(password) {
        this.salt = crypto.randomBytes(32).toString('hex');
        this.hash = this.encryptPassword(password);
    });

userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha512', this.salt).update(password).digest('hex');
};

userSchema.methods.verifyPassword = function(password) {
    return this.encryptPassword(password) === this.hash;
};

userSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('User', userSchema);
