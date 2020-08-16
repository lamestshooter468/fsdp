const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Covid-19 Self-Checker';
	res.render('home', { title: title }) 
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/showLogin', (req, res) => {
	res.render('user/login');
})

router.get('/showRegister', (req, res) => {
	res.render('user/register')
})

router.get("/ContactUs", (req, res) => {
	res.render("./Support/Contact");
})

router.get("/email", (req, res) => {
	res.render("./Support/Email")
})

router.post("/email", (req,res) => {
	let {email, spMessage} = req.body;
	var api_key = "key-d3f441b1ba5a353faf5e2ecb2c1f4113";
	var DOMAIN = "sandbox9c562b77bb4a4e498f2acb6a6d077304.mailgun.org";
	var mg = require("mailgun-js")({apiKey: api_key, domain: DOMAIN});
	var data = {
		from: "Support Team Self-Checker <SpTeamSelfChecker@gmail.com>",
		to: "SpTeamSelfChecker@gmail.com",
		subject: "Support",
		text: spMessage + "\n\nSent by: " + email
	};

	mg.messages().send(data, function(error, body) {
		if (error){
			console.log(error)
		}
		console.log(body);
	});

	let successful_msg = "Email sent successfully";

	res.render('./index', {successful_msg: successful_msg, title: "Assignment"})
})

module.exports = router;