const express = require('express');
const router = express.Router();
// User register URL using HTTP post => /user/register
const User = require("../models/User/UserModel");
const alertMessage = require("../helpers/messenger");
const bcrypt = require("bcryptjs")
const passport = require("passport");
const CommComments = require('../models/Community/Comments');
const Form = require('../models/FormModel/Form');
const CommCreate = require("../models/Community/Create")
const payMoney = require("../models/Support/PayMoney");

router.post("/Login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/showLogin",
        failureFlash: true
    })(req, res, next);
})

router.post('/Register', (req, res) => {
    let errors = [];
    // Retrieves fields from register page from request body
    let {name, email, password, password2} = req.body;
    // Checks if both passwords entered are the same
    if(password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }
    // Checks that password length is more than 4
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('user/register', {
        errors,
        name,
        email,
        password,
        password2});
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: {email: req.body.email} })
        .then(user => {
        if (user) {
            // If user is found, that means email has already been registered
            res.render('user/register', {
            error: user.email + ' already registered',
            name,
            email,
            password,
            password2
        });
        } else {
            // Generate salt hashed password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    password = hash;
                    // Create new user record
                    User.create({
                        name,
                        email,
                        password,
                        admin: false,
                        verification: 0
                    })
                    .then(user => {
                        var api_key = "key-d3f441b1ba5a353faf5e2ecb2c1f4113";
                        var DOMAIN = "sandbox9c562b77bb4a4e498f2acb6a6d077304.mailgun.org";
                        var mg = require("mailgun-js")({apiKey: api_key, domain: DOMAIN});
                        var data = {
                            from: "Support Team Self-Checker <SpTeamSelfChecker@gmail.com>",
                            to: email,
                            subject: "Support",
                            text: "An account has been created under your email address, please click the link below to verify your email address. \nhttp://localhost:5000/user/validate/" + email
                        };

                        mg.messages().send(data, function(error, body) {
                            if (error){
                                console.log(error)
                            }
                            console.log(body);
                        });
                        
                        alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                        res.redirect('/showLogin');
                    })
                    .catch(err => console.log(err));
                })
            });
            
        }
    });
}
});

router.get('/validate/:mail', (req, res) => {
    User.update({
        verification: 1
    }, { where: { email: req.params.mail} }).then(() => {
        res.render("./verified")
    }).catch(err => console.log(err));
});

router.get("/:id", (req,res) =>{
    if (req.user){
        if (req.user.id == req.params.id){
            res.render('./user/details', {user: req.user, check: true})
        }
    }else{
        User.findOne({ where: {id: req.params.id} }).then((user) =>{
            res.render('./user/deatils', {user: user, check: false})
        })
    }
})

router.get('/update/:id', (req,res) => {
    res.render("./user/update", {user: req.user})
})

router.post('/update/:id', (req, res) =>{
    let {name, email, password} = req.user
    let password2 = password
    if (req.body.name != ""){
        name = req.body.name
    }
    if (req.body.email != ""){
        email = req.body.email
    }if (req.body.password != ""){
        password = req.body.password
    }
    if (req.body.password2 != ""){
        password2 = req.body.password2
    }
    if (password != password2){
        User.findOne({ where: {email: email} }).then((user) => {
            res.render("./user/update", {error_msg: "Passwords do not match", user: user})
        })
    } else{
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                password = hash;
            })
        })
    }
    // Create new user record
    User.update({
        name,
        email,
        password,
        admin: req.user.admin,
        verification: req.user.verification},
        { where: {email: email} }
    ).then(() => {
        CommComments.update({
            userName: name
        }, { where: {userID: req.user.id} })}).then(() =>{
        alertMessage(res, 'success', 'Changes saved successfully', 'fas fa-sign-in-alt', true);
        res.redirect('/user/details' + req.params.id);
    })
})

router.get('/staff/:id', (req, res) => {
    if (req.user){
        if (req.user.admin){
            payMoney.findAll({
                raw: true
            }).then((donation) => {
                res.render("./StaffPage/staff", {donation:donation})
            })
            
        } else{
            console.log(req.user.admin);
            alertMessage(res, 'danger', 'You are not authenticated!', 'fas fa-sign-in-alt', true);
            res.redirect('/')
        }
    } else {
        alertMessage(res, 'danger', 'You are not logged in!', 'fas fa-sign-in-alt', true);
        res.redirect('/')
    }
})

router.get('/staff/:id/results', (req, res) => {
    if (req.user){
        if (req.user.admin){
            Form.findAll({
            })
            .then((forms) => {
                let countM = 0
                let countS = 0
                let countN = 0
                let countMY = 0
                let countSY = 0
                let countNY = 0
        
                for (i in forms) {
                    if (forms[i].results == 'mild'){
                        countM = countM + 1;
                    }
        
                    if (forms[i].results == 'severe'){
                        countS = countS + 1;
                    }
        
                    if (forms[i].results == 'normal'){
                        countN = countN + 1;
                    }
        
                    if (forms[i].results == 'mild' && forms[i].travelled == 'Yes'){
                        countMY = countMY + 1;
                    }
        
                    if (forms[i].results == 'severe' && forms[i].travelled == 'Yes'){
                        countSY = countSY + 1;
                    }
        
                    if (forms[i].results == 'normal' && forms[i].travelled == 'Yes'){
                        countNY = countNY + 1;
                    }
                }
        
        
                
                res.render('./StaffPage/resultcases', { 
                    countM: countM,
                    countS: countS,
                    countN: countN,
                    countMY: countMY,
                    countMN: (countM - countMY),
                    countSY: countSY,
                    countSN: (countS - countSY),
                    countNY: countNY,
                    countNN: (countN - countNY)
        
                });
            })
            .catch(err => console.log(err))
        } else{
            console.log(req.user.admin);
            alertMessage(res, 'danger', 'You are not authenticated!', 'fas fa-sign-in-alt', true);
            res.redirect('/')
        }
    } else {
        alertMessage(res, 'danger', 'You are not logged in!', 'fas fa-sign-in-alt', true);
        res.redirect('/')
    }
})

router.get("/userPost/:id", (req,res) => {
    CommCreate.findAll({
        where: {userID: req.params.id}
    }).then((create) => {
        res.render('./user/userPost', {
            post: create,
        });
    }).catch(err => console.log(err));
})

router.post('/userPost/:id', (req,res) => {
    if ((req.body.filter != "All") && (req.body.search != "")){
        CommCreate.findAll({
            where: {[Op.and]: [{type: req.body.filter}, {title: {[Op.like]: "%" + req.body.search + "%"}}], userID: req.params.id}
        }).then((create) =>{
            res.render("./user/userPost",{
                post: create
            });
        }).catch(err => console.log(err))
    }
    else if ((req.body.filter != "All") && (req.body.search == "")){
        CommCreate.findAll({
            where: {type: req.body.filter, userID: req.params.id}
        }).then((create) => {
            res.render("./user/userPost", {
                post: create
            });
        }).catch(err => console.log(err))
    }
    else if (req.body.search != ""){
        CommCreate.findAll({
            where:{title: {[Op.like]: "%" + req.body.search + "%"}, userID: req.params.id}
        }).then((create) => {
            res.render('./user/userPost', {
                post: create,
            });
        }).catch(err => console.log(err));
    }
    else{
        res.redirect("./" + req.params.id)
    }
})

router.get("/userDonations/:id", (req,res) => {
    payMoney.findAll({
        where: {name: req.user.name}
    }).then((donations) => {
        res.render('./user/userDonations', {
            donations: donations,
        });
    }).catch(err => console.log(err));
})

module.exports = router;