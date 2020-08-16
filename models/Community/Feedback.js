const Sequelize = require("sequelize");
const db = require('../../config/DBConfig');

const CommFeedback = db.define('CommFeedback',{
    subject:{
        type: Sequelize.TEXT
    },
    feedback:{
        type: Sequelize.TEXT
    }
})

module.exports = CommFeedback;