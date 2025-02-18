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


/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.vehicleDetailView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);  // Extract the vehicle ID from the URL
    let nav = await utilities.getNav();  // Get the navigation
    const itemData = await invModel.getInventoryById(inv_id);  // Fetch the vehicle data by ID
  
    if (!itemData) {
      return res.status(404).send("Vehicle not found");
    }
  
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;  // Vehicle name
    res.render("./inventory/vehicle-details", {
      title: itemName,  // Set the title to vehicle name
      nav,  // Navigation
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    });
  };
  

invCont.managementView = async function (req, res) {
  const flashMessage = req.flash('message'); // Retrieve the flash message
  res.render('inventory/inventoryManagement', {
      title: 'Inventory Management',
      flashMessage: flashMessage
  });
};


invCont.buildManagementView = async function (req, res, next){
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inv/inventoryManagement", {
        title: 'Inventory Management',
        flashMessage: flashMessage});
};

invCont.addClassificationView = async function (req, res) {
    res.render('inv/add-classification', {
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
    res.render('inv/add-item', {
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


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inv/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  }


  /* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }

  
module.exports = invCont