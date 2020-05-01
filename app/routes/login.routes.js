module.exports =(app) => {
    const logins = require('../controllers/login.controller.js');
    
    //Create a new Address
    app.post('/logins', logins.create);
    
    //Check login details
    //app.get('/logins/:username/:password', logins.checkLogin)
    
    }
