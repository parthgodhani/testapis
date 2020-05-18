var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: ''
    },
    usertype: {
        type: String,
        default: 'USER'
    },
    registerTime: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    status: {
        type: Number,
        default: 0
    }
});
var userModel = module.exports = mongoose.model('users_data', userSchema);