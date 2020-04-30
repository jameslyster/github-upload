const Login = require('../models/login.model.js');

//Create and Save a new user
exports.create = (req, res) => {
        
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors.errors);
        return res.status(422).json({ errors: errors.array() });
        
    }*/
    
    //Create an Address
    const login = new Login({
        username: req.body.username,
        password: req.body.password,
        active: true
    });

    //Save Address in the database
    login.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the login.'
        });
    });
};