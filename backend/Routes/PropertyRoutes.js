const express = require('express');
const router = express.Router();
const PropertyController = require('../Controllers/PropertyController');

// Define property routes
router.post('/', PropertyController.createProperty);
router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);
router.put('/:id', PropertyController.updateProperty);
router.delete('/:id', PropertyController.deleteProperty);

module.exports = router;
