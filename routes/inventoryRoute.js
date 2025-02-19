// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const invCont = {}

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the vehicle details view
router.get("/detail/:inv_id", invController.vehicleDetailView);


router.get('/error-test', (req, res, next) => {
    const error = new Error("Intentional Error");
    error.status = 500;
    next(error); // Pass to error handler
});

// Management view route
router.get('/inventory', invController.managementView);
router.get('/inventory', reviewController.addReview);

// routes/inventory-router.js

router.get('/add-classification', invController.addClassificationView);
router.post('/add-classification', invController.addClassification);

// routes/inventory-router.js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get('/add-item', invController.addItemView);
router.post('/add-item', invController.addItem);


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

  router.post("/update/", invController.updateInventory)

module.exports = router;