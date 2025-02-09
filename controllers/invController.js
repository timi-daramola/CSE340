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

module.exports = invCont