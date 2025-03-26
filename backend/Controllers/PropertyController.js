const Property = require('../Model/PropertyModel');

// Create a new property
exports.createProperty = async (req, res) => {
    try {
        const { name, location, price, description, availability } = req.body;
        const newProperty = new Property({ name, location, price, description, availability });
        await newProperty.save();
        res.status(201).json({ message: 'Property created successfully', property: newProperty });
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving properties', error: error.message });
    }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving property', error: error.message });
    }
};

// Update a property by ID
exports.updateProperty = async (req, res) => {
    try {
        const { name, location, price, description, availability } = req.body;
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { name, location, price, description, availability },
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
};

// Delete a property by ID
exports.deleteProperty = async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
};
