const express = require('express');
const router = new express.Router() 
const reviewController = require('../controllers/reviewController');


// Route to display a review inserting page
router.get("/addReview", reviewController.addReview)

// Route to submit a review
router.post('/reviews', reviewController.createReview);

// Route to get reviews for a specific vehicle
router.get('/reviews/:inv_id', reviewController.getReviewsForCar);

module.exports = router;

