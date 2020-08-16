const Sequelize = require("sequelize");
const db = require('../../config/DBConfig');


const CommCreate = db.define('CommCreate', {
    type: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.TEXT
    },
    text: {
        type: Sequelize.TEXT
    },
    date:{
        type: Sequelize.DATE
    },
    userID:{
        type: Sequelize.INTEGER
    },
    userName:{
        type: Sequelize.STRING
    }
});

module.exports = CommCreate;