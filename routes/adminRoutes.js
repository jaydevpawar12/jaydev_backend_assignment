const adminController=require("../controller/adminController")

const router=require("express").Router()
router

.get("/",adminController.getAllUser)

module.exports = router