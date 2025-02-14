const pool = require("../database/")

// Create a new review
const createReview = async (accountId, invId, rating, reviewText) => {
    try {
        const result = await m('pool.query')(
            'INSERT INTO reviews (account_id, inv_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING review_id, account_id, inv_id, rating, review_text, review_date',
            [accountId, invId, rating, reviewText]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error creating review: ' + err.message);
    }
};

// Fetch all reviews for a specific vehicle
const getReviewsForCar = async (invId) => {
    try {
        const result = await pool.query(
            'SELECT r.rating, r.review_text, r.review_date, a.account_firstname, a.account_lastname FROM reviews r JOIN account a ON r.account_id = a.account_id WHERE r.inv_id = $1 ORDER BY r.review_date DESC',
            [invId]
        );
        return result.rows;
    } catch (err) {
        throw new Error('Error fetching reviews: ' + err.message);
    }
};

// Calculate the average rating for a vehicle
const calculateAverageRating = async (invId) => {
    try {
        const result = await pool.query(
            'SELECT AVG(rating) AS average_rating FROM reviews WHERE inv_id = $1',
            [invId]
        );
        return result.rows[0].average_rating || 0;
    } catch (err) {
        throw new Error('Error calculating average rating: ' + err.message);
    }
};

module.exports = { createReview, getReviewsForCar, calculateAverageRating };