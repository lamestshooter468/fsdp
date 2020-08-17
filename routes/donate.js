const express=require("express");
const router=express.Router();
const payMoney=require("../models/Support/PayMoney");
const alertMessage = require("../helpers/messenger");

router.get("/SupportUs",(req,res)=>{
    res.render("./donate/whySupport");
});
router.get("/ThanksForSupporting",(req,res)=>{
    res.render("./donate/postSupport");
})
router.post("/changeValue",(req,res)=>{
    let amount=req.body.donAmt;
    let email=req.body.donEmail;
    let name=req.body.donName;
    let message=req.body.donMsg;
    let CNo=req.body.donCNo;
    let CExpDate=req.body.donExpDate;
    let CSecNo=req.body.donCcv;

    res.render("./donate/whySupport",{
        amount,
        email,
        name,
        message,
        CNo,
        CExpDate,
        CSecNo
    })
})
router.post("/processPayment",(req,res,next)=>{
    let amount=req.body.donAmt * 2;
    let email=req.user ? req.user.email : req.body.donEmail;
    let name=req.user ? req.user.name : req.body.donName;
    let message=req.body.donMsg;
    let CNo=req.body.donCNo;
    let CExpDate=req.body.donExpDate;
    let CSecNo=req.body.donCcv;

    var date= new Date();
    let dateDonated=date.toLocaleDateString("en-sg");
    console.log(CNo === "6415212541353415");
    
    payMoney.create({
        amount,
        email,
        name,
        message,
        CNo,
        CExpDate,
        CSecNo,
        dateDonated
    })
    .then()
    .then((donation)=>{
        var api_key = "key-d3f441b1ba5a353faf5e2ecb2c1f4113";
        var DOMAIN = "sandbox9c562b77bb4a4e498f2acb6a6d077304.mailgun.org";
        var mg = require("mailgun-js")({apiKey: api_key, domain: DOMAIN});
        var data = {
            from: "Support Team Self-Checker <SpTeamSelfChecker@gmail.com>",
            to: email,
            subject: "Support",
            text: "Your Donations has been confirmed. The details of the donation can be found below\nID: " + donation.id +   "\nAmount: " + amount + "\nDate Donated: " + dateDonated + "\nCard used: " + CNo + "\n\nThank you for supporting our cause, we greatly appreciate your donation."
        };

        mg.messages().send(data, function(error, body) {
            if (error){
                console.log(error)
            }
            console.log(body);
        });
        
        alertMessage(res, 'success', "You have successfully donated, an email will be sent to you shortly.", 'fas fa-check-circle green', true);
        res.redirect("./ThanksForSupporting");
    }).catch(err => console.log(err));
});

module.exports=router;