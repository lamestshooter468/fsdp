const express = require('express');
const router = express.Router();
const moment = require('moment');
const Form = require('../models/FormModel/Form');
const Booking = require('../models/FormModel/Booking');
const alertMessage = require('../helpers/messenger');

router.get('/bookingacknowledgement', (req, res) => {
	const title = 'Covid-19 Self-Checker';
	alertMessage(res, 'info', 'Your booking has been processed by the Ministry of Health. Please wait for your appointment confirmation within 2 working days via your preferred contact method. \nIn the meantime, you may check on https://www.flugowhere.gov.sg/ for the nearest clinic that you might visit for your appointment.', 'fa fa-info', true);
	res.render('home', { title: title }) 
});

router.get('/selfcheckerform', (req, res) => {
	res.render('form/scform');
});

router.get('/bookapptform', (req, res) => {
	res.render('form/bookingform');
});

router.post('/bookapptform', (req, res, next) => {
	let name = req.body.name;
	let contactNumber = req.body.contactNumber;
	let email = req.body.email;
	let address = req.body.address;
	let contactmethod = req.body.contactmethod;
	let preferred_date =  moment(req.body.date, 'DD/MM/YYYY');
	let preferred_timing = req.body.timing === undefined ? '' : req.body.timing.toString();

	Booking.create({
		name,
		contactNumber,
		email,
		address,
		contactmethod,
		preferred_date,
		preferred_timing
	})

		.then(booking => {
			var apiKey = 'key-e119dcd6c398c65c449c5116c7fa60ce'
			var DOMAIN = 'sandboxa03bfc936d14446e9c38df184f16bfc7.mailgun.org';
			var mg = require('mailgun-js')({apiKey: apiKey, domain: DOMAIN});
			var data = {
				from: 'Support Team Covid-19 Self-Checker <project0test0@gmail.com>',
				to: 'project0test0@gmail.com',
				subject: 'Appointment Booking For Covid-19 Swab Test',
				text: 'Dear Sir/Madam, \n' + 'The details below are regarding a person who is suspected to have severe symptoms of Covid-19. Please do look through it and arrange an appointment for a swab test for him/her at the nearest clinic of their homes.\n' 
				+ 'Details:\n' + 'Name: ' + booking.name + '\nContact Number: ' + booking.contactNumber + '\nEmail: ' 
				+ booking.email + '\nAddress: ' + booking.address + '\nPreferred Contact Method: ' + booking.contactmethod
				+ '\nPreferred Date of appointment: ' + booking.preferred_date + '\nPreferred Time of Appointment: ' 
				+ booking.preferred_timing + '\nThank You.' + '\n' + '\nRegards,' 
				+ '\nSupport Team Covid-19 Self-Checker'
			};
			mg.messages().send(data, function(error, body) {
				if (error){
					console.log(error);
				}
				console.log(body);
			});
			},	
			res.redirect('/selfchecker/bookingacknowledgement'))
		.catch(err => console.log(err));
});


router.post('/selfcheckerform', (req, res, next) => {
	let name = req.body.name;
	let gender = req.body.gender;
	let contactNumber = req.body.contactNumber;
	let email = req.body.email;
	let address = req.body.address;
	let travelled = req.body.travelled;
	let Ssymptoms = req.body.Ssymptoms === undefined ? '' : req.body.Ssymptoms.toString();
	let Nsymptoms = req.body.Nsymptoms === undefined ? '' : req.body.Nsymptoms.toString();
    let severity = req.body.severity;

	// severe
	if (Ssymptoms == 'Fever', Ssymptoms == 'Dry Cough', Ssymptoms == 'Tiredness', Ssymptoms == 'Difficulty Breathing', Ssymptoms == 'Chest Pain/Pressure', Ssymptoms == 'Loss Speech/Movement' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness', 'Difficulty Breathing', 'Chest Pain/Pressure', 'Loss Speech/Movement' && severity == 5) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness', 'Difficulty Breathing', 'Chest Pain/Pressure' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness', 'Difficulty Breathing', 'Chest Pain/Pressure' && severity == 5) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness', 'Difficulty Breathing' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness', 'Difficulty Breathing' && severity == 5) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough', 'Tiredness' && severity == 5) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever', 'Dry Cough' && severity == 5) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever' && severity == 4) {
		results = 'severe';
	}

	else if (Ssymptoms == 'Fever' && severity == 5) {
		results = 'severe';
	}


	// normal
	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache', 'Loss Taste/Smell', 'Skin Rash' && severity == 1) {
        results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache', 'Loss Taste/Smell', 'Skin Rash' && severity == 2) {
        results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache', 'Loss Taste/Smell' && severity == 1) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache', 'Loss Taste/Smell' && severity == 2) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache' && severity == 1) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea', 'Headache' && severity == 2) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea' && severity == 1) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat', 'Diarrhoea' && severity == 2) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat' && severity == 1) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain', 'Sore throat' && severity == 2) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain' && severity == 1) {
		results = 'normal';
	}

	else if (Nsymptoms == 'AchesPain' && severity == 2) {
		results = 'normal';
	}

	else {
		results = 'mild';
	}

	Form.create({
		name,
		gender,
		contactNumber,
		email,
		address,
		travelled,
		Ssymptoms,
		Nsymptoms,
		severity,
		results
	})

		.then(form => {
			var apiKey = 'key-e119dcd6c398c65c449c5116c7fa60ce'
			var DOMAIN = 'sandboxa03bfc936d14446e9c38df184f16bfc7.mailgun.org';
			var mg = require('mailgun-js')({apiKey: apiKey, domain: DOMAIN});
			var data = {
				from: 'Support Team Covid-19 Self-Checker <project0test0@gmail.com>',
				to: 'project0test0@gmail.com',
				subject: 'Covid-19 Self-Checker Results',
				text: 'Dear ' + form.name + ',' + '\nThank you for using our Self-Checker Form. Your symptoms for Covid-19 is ' + form.results
				+ '.' + '\nYour inputs are:\n ' + 'Common Symptoms: ' + form.Ssymptoms + '\n' + 'Less Common Symptoms: ' + form.Nsymptoms + '\nSeverity Level: ' + form.severity
				+ ''
			};

			mg.messages().send(data, function(error, body) {
				if (error){
					console.log(error);
				}
				console.log(body);
			});
			},
			
			res.redirect('/selfchecker/response/' + results))
		.catch(err => console.log(err));
});


router.get('/response/:results', (req, res) => {
	Form.findOne({
		where: {
			results: req.params.results
		}
	}).then((form) => {
		if (req.params.results == 'severe') {
			const response = 'You have a high chance of having the virus. Please call 995 or go to an Emergency Department (A&E) at a hospital.';
			alertMessage(res, 'info', 'Your results: Severe symptoms', 'fa fa-info', true);
			res.render('form/response', { 
				form,
				response: response
			});
		}

		if (req.params.results == 'mild') {
			const response = 'Please stay home and monitor yourself for 2-3 days. If your condition worsened, please visit the nearest clinic for a check up or go to an Emergency Department (A&E) at a hospital.';
			alertMessage(res, 'info', 'Your results: Mild symptoms', 'fa fa-info', true);
			res.render('form/response', { 
				form,
				response: response
			});
		}

		if (req.params.results == 'normal') {
			const response = 'Please continue to stay at home and stay hydrated.';
			alertMessage(res, 'info', 'Your results: No severe or mild symptoms', 'fa fa-info', true);
			res.render('form/response', { 
				form,
				response: response
			});
		}

	}).catch(err => console.log(err)); 
});

module.exports = router;