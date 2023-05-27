const express = require('express');
const { registerUser, authUser, updateUser, allUsers } = require('../controllers/userControllers');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/login').post(authUser);
router.route('/').post(registerUser).get(protect,allUsers);
router.route('/:id').put(updateUser);

module.exports = router;