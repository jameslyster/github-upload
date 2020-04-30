module.exports =(app) => {
    const addresses = require('../controllers/address.controller.js');
    const { check, validationResult } = require('express-validator');
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
    }

    var date = formatDate(new Date);

    //Create a new Address
    app.post('/addresses', [
        check('name').isLength({ min: 5, max: 30 }).withMessage('Name must be between 5 and 30 characters'),
        check('address').isLength({min: 10, max: 100}).withMessage('Address must be between 10 and 100 characters'),        
        check('phone').isMobilePhone().withMessage('This is not a valid Phone Number'),
        check('DOB').isISO8601().withMessage('That is not a valid date'),
        check('DOB').isBefore(date).withMessage('THIS PERSON HAS NOT BEEN BORN YET!!! RELAX!!!!'),
        check('DOB').isAfter('1903-01-02').withMessage('The person with the birthday you are trying to enter is dead, soz')
      ], addresses.create);

    //Retrieve all addresses
    app.get('/addresses', addresses.findAll);

    //retrieve a single Address with addressId
    //app.get('/addresses/:id', addresses.findOne);

    //retrieve a single Address with addressId
    app.get('/addresses/:searchType/:searchString', addresses.findByString);

    //Update a address with addressId
    app.put('/addresses/:addressId', addresses.update);
    
    //Update a address with addressId
    app.patch('/addresses/:addressId', [
      check('name').isLength({ min: 5, max: 30 }).withMessage('Name must be between 5 and 30 characters'),
      check('address').isLength({min: 10, max: 100}).withMessage('Address must be between 10 and 100 characters'),        
      check('phone').isMobilePhone().withMessage('This is not a valid Phone Number'),
      check('DOB').isISO8601().withMessage('That is not a valid date'),
      check('DOB').isBefore(date).withMessage('THIS PERSON HAS NOT BEEN BORN YET!!! RELAX!!!!'),
      check('DOB').isAfter('1903-01-02').withMessage('The person with the birthday you are trying to enter is dead, soz')
    ], addresses.updatePatch);

    //Delete a Address with addressId
    app.delete('/addresses/:addressId', addresses.delete);
}