var mongoose = require('mongoose');
var agencySchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    address1: {
        type: String,
        default: ''
    },
    address2: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    phone:{
        type: String,
        default: ''
    }

});

var userModel = module.exports = mongoose.model('agency_data', agencySchema);
