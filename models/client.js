var mongoose = require('mongoose');
var clientSchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    totalBill:{
        type: Number,
        default: 0
    },
    agencyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agency_data'
    }

});

var userModel = module.exports = mongoose.model('client_data', clientSchema);
