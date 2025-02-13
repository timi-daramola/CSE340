const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.showVehicleDetail = async function (req, res, next) {
    try {
        const vehicleId = req.params.classificationId;
        const vehicle = await invModel.getVehicleById(vehicleId);
        const vehicleHtml = await utilities.vehicleDetailsToHtml(vehicle)
        let nav = await utilities.getNav()
        if (!vehicle) {
            return res.status(404).send("Vehicle not found");
        }
        res.render(".inventory/detail", {
            title: `${vehicle.make} ${vehicle.model}`,
            nav,
            vehicleHtml: vehicleHtml,
            vehicle: vehicle
        });
    } catch (err) {
        next(err);
    }
};


invCont.managementView = async function (req, res) {
  const flashMessage = req.flash('message'); // Retrieve the flash message
  res.render('inventory/management', {
      title: 'Inventory Management',
      flashMessage: flashMessage
  });
};


invCont.buildManagementView = async function (req, res, next){
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
    ... remaining render code is not shown ...

invCont.addClassificationView = async function (req, res) {
    res.render('inventory/add-classification', {
        title: 'Add New Classification',
        flashMessage: req.flash('message')
    });
};

invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body;

    // Server-side validation
    if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
        req.flash('message', 'Invalid classification name. No spaces or special characters allowed.');
        return res.redirect('/inv/add-classification');
    }

    try {
        await invModel.addClassification(classification_name);
        req.flash('message', 'Classification added successfully!');
        res.redirect('/inv');
    } catch (err) {
        req.flash('message', 'Failed to add classification. Please try again.');
        res.redirect('/inv/add-classification');
    }
};


invCont.addItemView = async function (req, res) {
    const classificationList = await utilities.buildClassificationList(); // Fetch classifications for dropdown
    res.render('inventory/add-item', {
        title: 'Add New Inventory Item',
        classificationList: classificationList,
        flashMessage: req.flash('message'),
        stickyData: req.session.stickyData || {} // Store sticky data in session
    });
};

invCont.addItem = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_description, classification_id } = req.body;

    // Server-side validation
    if (!inv_make || !inv_model || !inv_year || !inv_price || !inv_mileage || !inv_description || !classification_id) {
        req.flash('message', 'All fields are required.');
        req.session.stickyData = req.body; // Save data for sticky form
        return res.redirect('/inv/add-item');
    }

    try {
        await invModel.addItem({ inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_description, classification_id });
        req.flash('message', 'Inventory item added successfully!');
        delete req.session.stickyData; // Clear sticky data after successful submission
        res.redirect('/inv');
    } catch (err) {
        req.flash('message', 'Failed to add inventory item. Please try again.');
        req.session.stickyData = req.body; // Save data for sticky form
        res.redirect('/inv/add-item');
    }
};

module.exports = invCont