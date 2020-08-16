const Sequelize = require('sequelize');
const db = require('../../config/DBConfig');

const Booking = db.define('book', {
    name: {
        type: Sequelize.STRING
    },
    contactNumber: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    contactmethod: {
        type: Sequelize.STRING
    },
    preferred_date: {
        type: Sequelize.DATE
    },
    preferred_timing: {
        type: Sequelize.STRING
    }
});

module.exports = Booking;