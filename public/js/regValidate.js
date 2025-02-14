// regValidate.js
const { body, validationResult } = require('express-validator');

const loginRules = () => {
  return [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  ];
};

const checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  loginRules,
  checkLoginData,
};
