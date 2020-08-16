const Sequelize = require('sequelize');
const db = require('../../config/DBConfig');

const Form = db.define('form',{ 	
	name: {
		type: Sequelize.STRING
	},
	gender: {
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
  travelled: {
    type: Sequelize.STRING
  },
  Ssymptoms: {
    type: Sequelize.STRING
  },
  Nsymptoms: {
    type: Sequelize.STRING
    },
  severity: {
    type: Sequelize.INTEGER
    },
  results: {
    type: Sequelize.STRING
    },
});

module.exports = Form;