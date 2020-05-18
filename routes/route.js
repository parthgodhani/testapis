var express = require('express');
var router = express.Router();
var crypto = require("crypto-js");
var AES_KEY = '6fnhkgo71s0caeqma6ojjftu4n1m1d85';

var userModel = require("../models/user");


var main = require('../apis/main');
var agency = require('../apis/agency');

/*************************************************************************/
module.exports = router;
//basic
router.post('/api/login', main.fnLogin);
router.post('/api/register', main.fnRegister);
router.post('/api/create_agency_client',agency.fnAddAgencyAndClient)
//open for all (sencetive data)

// open for users
// router.post('/api/*', fnAuthoriseToken(), agency.fnListAllAgency);
router.all('/api/agency/*', fnAuthoriseToken());
router.get('/api/agency/get',agency.fnListAllAgency)
/**fnGetChildDataCount */
function fnAuthoriseToken() {
        var response = {
                status: 'error',
                msg: "Unauthorised request."
        };
        return function (req, res, next) {
                var url = req.originalUrl;
                if (req.headers && req.headers.authorization) {
                        var parts = req.headers.authorization.split(' ');
                        if (parts && parts.length >= 2) {
                                if (parts[0] === 'Bearer') {
                                        var str = parts[1];
                                        var data = crypto.AES.decrypt(str, AES_KEY).toString(crypto.enc.Utf8);
                                        if (data) {
                                                userModel.findById(data).exec(function (e1, userData) {
                                                        if (!e1) {
                                                                if (userData && userData._id) {
                                                                        req.session.userId = userData._id;
                                                                        req.session.name = userData.name;
                                                                        req.session.firstName = userData.firstName;
                                                                        req.session.lastName = userData.lastName;
                                                                        req.session.companyEmail = userData.companyEmail;
                                                                        req.session.personalEmail = userData.personalEmail;
                                                                        req.session.phone = userData.phone;
                                                                        req.session.userName = userData.userName;
                                                                        req.session.usertype = userData.usertype;
                                                                        req.session.status = userData.status;
                                                                        return next();
                                                                } else {
                                                                        res.json(response);
                                                                }


                                                        } else {
                                                                console.log('Server error --> fnAuthorise --> e1 --> ', e1);
                                                                return res.status(500).json(response);
                                                        }
                                                })
                                        }
                                        else {
                                                console.log(1)
                                                console.log('Server error --> fnAuthorise --> data missmatch --> 1 --> ');
                                                return res.status(401).json(response);
                                        }
                                }
                                else {
                                        console.log(11)
                                        console.log('Server error --> fnAuthorise ---> Bearer missmatch --> 11 --> ');
                                        return res.status(401).json(response);
                                }
                        }
                        else {
                                console.log(111)
                                console.log('Server error --> fnAuthorise --> parts and parts length missmatch --> 111 --> ');
                                return res.status(401).json(response);
                        }
                }
                else {
                        console.log(1111)
                        console.log('Server error --> fnAuthorise --> authorization does not exist on header --> 1111 --> ');
                        return res.status(401).json(response);
                }
        }
}

