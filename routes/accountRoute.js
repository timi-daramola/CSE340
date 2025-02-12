// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build login view

accountController.accountLogin
// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.get("/register", accountController.buildRegister)
router.get("/login", accountController.buildLogin)
router.get("/", accountController.accountLogin)


accountController.accountLogin
// Process the login request
router.post(
    "/",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.get("/register", accountController.buildRegister)

module.exports = router;
