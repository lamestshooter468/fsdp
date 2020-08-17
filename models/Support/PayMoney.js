const Sequelize=require("sequelize");
const db=require("../../config/DBConfig");

const Paymoney=db.define("donation",{
    amount:{type:Sequelize.INTEGER},
    email:{type:Sequelize.STRING},
    message:{type:Sequelize.STRING(250)},
    name:{type:Sequelize.STRING},
    CNo:{type:Sequelize.STRING},
    CExpDate:{type:Sequelize.INTEGER},
    CSecNo:{type:Sequelize.INTEGER},
    dateDonated:{type:Sequelize.DATE}
});
module.exports=Paymoney;