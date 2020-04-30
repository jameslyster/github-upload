const Address = require('../models/address.model.js');
const { check, validationResult } = require('express-validator');

//Create and Save a new Address
exports.create = (req, res) => {
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors.errors);
        return res.status(422).json({ errors: errors.array() });
        
    }
    
    //Create an Address
    const address = new Address({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        DOB: req.body.DOB
    });

    //Save Address in the database
    address.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Address.'
        });
    });
};

//Retrieve and return all addresses from the database
exports.findAll = (req, res) => {
    Address.find().then(addresses => {
        res.send(addresses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving addresses."
        });
    });
};

//Find a single address with a addressId
exports.findOne = async (req, res) => {
    let id = req.params.addressId;
    Address.findById(id).then(address => {
        if(!address) {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        res.send(address);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        return res.status(500).send({
            message: 'Error retrieving address with id ' +req.params.addressId
        });
    });
};

//Find all addresses containing specific string
exports.findByString = async (req, res) => {
    let searchType = req.params.searchType;
    let searchString = `${req.params.searchString}`;
    let body;
    console.log(searchType);
    console.log(searchString);

    if(searchType == 'name'){
        console.log('name=name'); 
        body = { name : { '$regex' : searchString, '$options' : 'i' }};     
    }else if(searchType == 'address'){
        console.log('address=address');
        body = { address : { '$regex' : searchString, '$options' : 'i' }};
    }else if(searchType == 'phone'){
        console.log('phone=phone');
        body = { phone : { '$regex' : searchString}};
    }

    await Address.find(body).then(addresses => {
        res.send(addresses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving addresses."
        });
    });

    /*await Address.find(id).then(address => {
        if(!address) {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        res.send(address);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        return res.status(500).send({
            message: 'Error retrieving address with id ' +req.params.addressId
        });
    });*/
};


//Update an address identified by the addressId in the request
exports.update = (req, res) => {
    //Validate Request
    if(!req.body.address) {
        return res.status(400).send({
            message: 'Address content cannot be empty'
        });
    }

    //Find address and update it with the request body
    Address.findByIdAndUpdate(req.params.addressId, {
        name: req.body.name || 'Untitled Address',
        phone: req.body.phone,
        address: req.body.address,
        DOB: req.body.DOB
    }, {new: true}).then(address => {
        if(!address) {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        res.send(address);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        return res.status(500).send({
            message: 'Error updating address with id ' + req.params.addressId
        });
    });
};

//PATCH
//Update an address identified by the addressId in the request
exports.updatePatch = (req, res) => {
    //Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors.errors);
        return res.status(422).json({ errors: errors.array() });
        
    }

    //Find address and update it with the request body
    Address.findByIdAndUpdate(req.params.addressId, {
        name: req.body.name || 'Untitled Address',
        phone: req.body.phone,
        address: req.body.address,
        DOB: req.body.DOB
    }, {new: true}).then(address => {
        if(!address) {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        res.send(address);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        return res.status(500).send({
            message: 'Error updating address with id ' + req.params.addressId
        });
    });
};


//Delete a address with the specified addressId in the request
exports.delete = (req, res) => {
    Address.findByIdAndRemove(req.params.addressId).then(address => {
        if(!address) {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        res.send({ message: 'Address deleted successfully'});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: 'Address not found with id ' + req.params.addressId
            });
        }

        return res.status(500).send({
            message: 'Could not delete address with id' + req.params.addressId
        });
    });

}