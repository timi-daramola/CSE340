// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get('/type/:detail', invController.showVehicleDetail);

router.get('/error-test', (req, res, next) => {
    const error = new Error("Intentional Error");
    error.status = 500;
    next(error); // Pass to error handler
});

// Management view route
router.get('/inv', invController.managementView);

// routes/inventory-router.js

router.get('/inv/add-classification', invController.addClassificationView);
router.post('/inv/add-classification', invController.addClassification);

// routes/inventory-router.js

router.get('/inv/add-item', invController.addItemView);
router.post('/inv/add-item', invController.addItem);

module.exports = router;