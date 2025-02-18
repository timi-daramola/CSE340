// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Process the login request
// router.post(
//     "/login",
//     regValidate.loginRules(),
//     regValidate.checkLoginData,
//     utilities.handleErrors(accountController.accountLogin)
//   )

router.post('/register', utilities.handleErrors(accountController.registerAccount))

router.get("/register", accountController.buildRegister)
router.get("/login", accountController.buildLogin)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))


module.exports = router;
