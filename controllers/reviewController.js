const reviewModel = require('../models/review');
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver Review view
* *************************************** */
async function addReview(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/addReview", {
      title: "Reviews",
      nav,
    })
  }

// Controller to create a review
const createReview = async (req, res) => {
    const { inv_id, rating, review_text } = req.body;
    const accountId = req.user.account_id;  // Assuming user is logged in and account_id is available in the session

    try {
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        const newReview = await reviewModel.createReview(accountId, inv_id, rating, review_text);
        res.status(201).json({
            message: 'Review submitted successfully!',
            review: newReview
        });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting review: ' + err.message });
    }
};

// Controller to get reviews for a specific vehicle
const getReviewsForCar = async (req, res) => {
    const { inv_id } = req.params;

    try {
        const reviews = await reviewModel.getReviewsForCar(inv_id);
        const averageRating = await reviewModel.calculateAverageRating(inv_id);
        res.status(200).json({
            reviews: reviews,
            averageRating: averageRating
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews: ' + err.message });
    }
};

module.exports = { createReview, getReviewsForCar, addReview };