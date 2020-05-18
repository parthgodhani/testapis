var userModel = require("../models/user");
var crypto = require("crypto-js");
var TOKEN_VALIDITY = 24 * 60 * 60 * 1000;
var AES_KEY = '6fnhkgo71s0caeqma6ojjftu4n1m1d85';

module.exports.fnLogin = async (req, res, next) => {
    var response = {
        status: 'error',
        msg: 'Something happened wrong, please try again after sometime.',
        data: {
        },
        method: req.url.split('/')[req.url.split('/').length - 1]
    }
    try {
        var phone = req.body.phone;
        var password = req.body.password;
        phone = (phone && typeof phone === 'string' && phone.length == 10) ? phone.trim() : null;   
        password = (password && typeof password === 'string') ? password.trim() : null;
        if (phone && password) {
            var result =  await userModel.findOne({phone:phone}).lean();
            
            if(result && result._id){
                password = crypto.SHA256(password).toString();
                if (result && result.password == password) {
                    delete result.password;
                    var token = result._id.toString()
                    token = crypto.AES.encrypt(token, AES_KEY).toString();
                    result.token = token;
                    response.status = 'success';
                    response.data = result;
                    response.msg = '';
                    res.status(200).json(response);
                } else {
                    response.msg = "Your password is wrong";
                    res.status(401).json(response);
                }
            }else{
                response.msg = "Your phone no is not associtaed with us try with register";
                res.status(401).json(response);
            }
        } else {
            response.msg = "Invalid parameter";
            res.status(422).json(response);
        }
    } catch (e) {
        console.log('Server error --> fnLogin --> e', e);
        res.status(500).json(response);
    }
}

module.exports.fnRegister = async (req, res, next) => {
    var response = {
        status: 'error',
        msg: 'Something happened wrong, please try again after sometime.',
        data: {
        },
        method: req.url.split('/')[req.url.split('/').length - 1]
    }
    try {
        var phone = req.body.phone;
        var password = req.body.password;
        phone = (phone && typeof phone === 'string' && phone.length == 10) ? phone.trim() : null;   
        password = (password && typeof password === 'string') ? password.trim() : null;
        if (phone && password) {
            var userData = await userModel.findOne({"phone":phone}).lean();
            console.log(userData);
            if( !(userData && userData._id) ){
                password = crypto.SHA256(password).toString();
                var savedUserData = await userModel({
                    "phone":phone,
                    "password":password
                }).save();
                var token = savedUserData._id.toString()
                token = crypto.AES.encrypt(token, AES_KEY).toString();
                savedUserData.token = token;
                savedUserData['token'] = token;
                response.status = 'success';
                response.data = savedUserData;
                response.msg = '';
                res.status(200).json(response);
            }else{
                response.msg = "Phone no is already availabel please try witjh login";
                res.status(422).json(response);
            }
        } else {
            response.msg = "Invalid parameter";
            res.status(422).json(response);
        }
    } catch (e) {
        console.log('Server error --> fnRegister --> e', e);
        res.status(500).json(response);
    }
}