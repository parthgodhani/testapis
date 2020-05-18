var agencyModel = require("../models/agency");
var clientModel = require("../models/client");
module.exports.fnAddAgencyAndClient = async (req,res,next) =>{
    var response = {
        status: 'error',
        msg: 'Something happened wrong, please try again after sometime.',
        data: {
        },
        method: req.url.split('/')[req.url.split('/').length - 1]
    }
    try {
        var name = req.body.name;
        var address1 = req.body.address1;
        var address2 = req.body.address2;
        var state = req.body.state;
        var city = req.body.city;
        var phone = req.body.phone;
        var email = req.body.email;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        name = (name && typeof name === 'string') ? name.trim() : null;
        address1 = (address1 && typeof address1 === 'string') ? address1.trim() : null;
        state = (state && typeof state === 'string') ? state.trim() : null;
        city = (city && typeof city === 'string') ? city.trim() : null;
        email = (email && typeof email === 'string' &&  re.test(String(email).toLowerCase())) ? email.trim() : null;
        phone = (phone && typeof phone === 'string' && phone.length == 10) ? phone.trim() : null;
        if(name && address1 && state && city && phone && email){
            var agencyUniquesVerifier =  await agencyModel.findOne({"phone":phone});
            
            if( !agencyUniquesVerifier || !agencyUniquesVerifier.phone){
                var clientUniquesVerifier = await clientModel.findOne({"phone":phone});
                if( !clientUniquesVerifier || !clientUniquesVerifier.email){
                    var agencyData = {
                            "name":name,
                            "address1":address1,
                            "address2":address2,
                            "state":state,
                            "city":city,
                            "phone":phone,
                    };
                    var storedAgencyData = await agencyModel(agencyData).save();
                    var clientData = {
                        "name":name,
                        "email":email,
                        "city":city,
                        "totalBill":0,
                        "agencyId":storedAgencyData._id
                    };
                    await clientModel(clientData).save();
                    response.msg="";
                    response.status ="success";
                    res.status(200).json(response);
                } else {
                    response.msg="Client email is already associated with us. Please try with new email"
                    res.status(422).json(response);
                }
            } else {
                response.msg="Phone no is already associated woth us. Please try  with new phone no"
                res.status(422).json(response);
            }
        } else {
            response.msg = "Invalid parameter";
            res.status(422).json(response);
        }
    } catch (e) {
        console.log('Server error --> fnAddAgencyAndClient --> e', e);
        res.status(500).json(response);
    }
}

module.exports.fnListAllAgency = async (req,res,next) =>{
    var response = {
        status: 'error',
        msg: 'Something happened wrong, please try again after sometime.',
        data: {
        },
        method: req.url.split('/')[req.url.split('/').length - 1]
    }
    try {
        var data = await clientModel.find().lean();
        response.data = data;
        response.status = "success";
        response.msg ="";
        res.status(200).json(response);
    } catch (e) {
        console.log('Server error --> fnListAllAgency --> e', e);
        res.status(500).json(response);
    }
}