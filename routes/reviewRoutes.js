const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Route to submit a review
router.post('/reviews', reviewController.createReview);

// Route to get reviews for a specific vehicle
router.get('/reviews/:inv_id', reviewController.getReviewsForCar);

module.exports = router;