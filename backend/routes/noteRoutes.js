const express = require('express');
const router = express.Router({ mergeParams: true });
const {getNotes, addNote} = require('../controllers/noteController.js');

const {protect} = require('../middleware/authMiddleware.js');

router.route('/').get(protect, getNotes).post(protect, addNote)

module.exports = router;