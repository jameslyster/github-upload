const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    DOB: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', AddressSchema);