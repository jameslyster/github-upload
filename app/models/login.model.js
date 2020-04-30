const mongoose = require('mongoose');

const LoginSchema = mongoose.Schema({
    username: String,
    password: String,
    active: Boolean
});

module.exports = mongoose.model('Login', LoginSchema);