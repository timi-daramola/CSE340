const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  async function getVehicleById(classification_id){
    const vehicle = await pool.query('SELECT * FROM public.inventory WHERE id = ?', [classification_id]);
    return vehicle.rows // Returns a single vehicle object
};


async function addClassification (classification_name) {
    const query = 'INSERT INTO classifications (classification_name) VALUES (?)';
    await pool.query(query, [classification_name]);
};


async function addItem ({ inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_description, classification_id }) {
  const query = 'INSERT INTO inventory (make, model, year, price, mileage, description, classification_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await pool.query(query, [inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_description, classification_id]);
};

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addItem};