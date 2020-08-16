const express = require("express");
const router = express.Router();
const CommCreate = require("../models/Community/Create");
const CommFeedback = require("../models/Community/Feedback");
const CommComments = require("../models/Community/Comments");
const User = require("../models/User/UserModel");
const {Op} = require("sequelize")

router.get("/comm", (req, res) =>{
    CommCreate.findAll({
        raw: true
    }).then((create) => {
        res.render('./community/comm', {
            post: create,
        });
    }).catch(err => console.log(err));
});

router.post("/comm", (req, res) => {
    if ((req.body.filter != "All") && (req.body.search != "")){
        CommCreate.findAll({
            where: {[Op.and]: [{type: req.body.filter}, {title: {[Op.like]: "%" + req.body.search + "%"}}]}
        }).then((create) =>{
            res.render("./community/comm",{
                post: create
            });
        }).catch(err => console.log(err))
    }
    else if ((req.body.filter != "All") && (req.body.search == "")){
        CommCreate.findAll({
            where: {type: req.body.filter}
        }).then((create) => {
            res.render("./community/comm", {
                post: create
            });
        }).catch(err => console.log(err))
    }
    else if (req.body.search != ""){
        CommCreate.findAll({
            where:{title: {[Op.like]: "%" + req.body.search + "%"}}
        }).then((create) => {
            res.render('./community/comm', {
                post: create,
            });
        }).catch(err => console.log(err));
    }
    else{
        res.redirect("./comm")
    }
});

router.post("/create", (req,res) => {
    let {type, title, text} = req.body;
    let userID = 0;
    let userName = req.user ? req.user.name : "Anonymous"
    let date = new Date().toLocaleDateString("en-SG");
    console.log(req.body);
    CommCreate.create({type, title, text, date, userID, userName})
    .then(
        res.redirect('./comm')
    ).catch(err => console.log(err));
})

router.get("/create", (req,res) =>{
    res.render("./community/create")
})

router.post("/feedback", (req,res) => {
    let {subject, feedback} = req.body;
    CommFeedback.create({subject, feedback}).then(feedback => {res.redirect("./comm")}).catch(err => console.log(err))
})

router.get("/feedback", (req,res) =>{
        res.render("./community/feedback");
});

router.get("/question/:id", (req,res) => {
    CommComments.findAll({ where: {questionID: req.params.id}}).then((comments) => {
        CommCreate.findOne({ where: {id: req.params.id}}).then((create) => {
            res.render("./community/post", {type: create.type, title: create.title, text: create.text, date: create.date ,id: create.id,name: create.userName, userId: create.userID, commentDB: comments})
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.post("/question/:id", (req,res) => {
    let date = new Date().toLocaleDateString("en-SG");
    let comment = req.body.comment;
    let questionID = req.params.id;
    let id = req.user ? req.user.id : false
    let name = req.user ? req.user.name : "Anonymous"
    CommComments.create({questionID, comment, date, userID: id, userName: name}).then(
    CommComments.findAll({where: {questionID: req.params.id}})).then((comments) => {
        res.redirect("../question/" + questionID)
    }).catch(err => console.log(err))
})

module.exports = router;