import React, { useState, useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText, Paper, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, 
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Alert 
} from "@mui/material";
import { Edit, Visibility, Delete, Add, PictureAsPdf } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PropertyDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [openViewDialog, setViewOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [propertyList, setPropertyList] = useState(() => {
    const saved = localStorage.getItem("propertyList");
    return saved ? JSON.parse(saved) : [];
  });
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    availability: "true"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("propertyList", JSON.stringify(propertyList));
  }, [propertyList]);

  const validateForm = (property) => {
    const newErrors = {};
    const lettersOnly = /^[a-zA-Z\s]+$/;
    const noSpecialChars = /^[a-zA-Z0-9\s.,-]+$/;
    
    if (!property.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!lettersOnly.test(property.name)) {
      newErrors.name = "Name should contain only letters";
    }
    
    if (!property.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!noSpecialChars.test(property.location)) {
      newErrors.location = "Location cannot contain special characters";
    }
    
    if (!property.price || isNaN(property.price) || Number(property.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (!property.description.trim()) {
      newErrors.description = "Description is required";
    } else if (!noSpecialChars.test(property.description)) {
      newErrors.description = "Description cannot contain special characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CRUD Operations
  const handleCreate = () => {
    if (validateForm(newProperty)) {
      setPropertyList([...propertyList, { ...newProperty, id: Date.now(), price: Number(newProperty.price) }]);
      setNewProperty({ name: "", location: "", price: "", description: "", availability: "true" });
      setOpenCreateDialog(false);
      setErrors({});
    }
  };

  const handleUpdate = () => {
    if (validateForm(newProperty)) {
      setPropertyList(propertyList.map(p => 
        p.id === selectedProperty.id ? { ...newProperty, id: p.id, price: Number(newProperty.price) } : p
      ));
      setEditOpenDialog(false);
      setErrors({});
    }
  };

  const handleDelete = (id) => {
    setPropertyList(propertyList.filter(p => p.id !== id));
  };

  // Search Functionality
  const filteredProperties = propertyList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateReport = () => {
    if (propertyList.length === 0) {
      alert("No properties available to generate report");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Property Listings Landora", pageWidth / 2, 25, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: "center" });
  
    doc.autoTable({
      head: [["Name", "Location", "Price ($)", "Description", "Availability"]],
      body: propertyList.map(p => [
        p.name,
        p.location,
        p.price.toLocaleString(),
        p.description.substring(0, 200) + (p.description.length > 200 ? "..." : ""),
        p.availability === "true" ? "Available" : "Not Available"
      ]),
      startY: 40,
      margin: { left: 15, right: 15 },
      styles: { fontSize: 10, cellPadding: 3, font: "times" },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [230, 240, 255] },
      didDrawPage: (data) => {
        doc.setDrawColor(0);
        doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);
        doc.setFontSize(10);
        doc.text(`Page ${data.pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
      }
    });
  
    doc.save("Property Listings Landora(Pvt).pdf");
  };
  

  // Dialog Handlers
  const handleOpenEdit = (property) => {
    setSelectedProperty(property);
    setNewProperty({ ...property, availability: property.availability.toString() });
    setEditOpenDialog(true);
  };

  const handleOpenView = (property) => {
    setSelectedProperty(property);
    setViewOpenDialog(true);
  };

  // Form Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Property Listings</Typography>
      
      <TextField
        fullWidth
        label="Search Properties"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => {
          setNewProperty({ name: "", location: "", price: "", description: "", availability: "true" });
          setErrors({});
          setOpenCreateDialog(true);
        }}
        sx={{ mb: 2, mr: 2 }}
      >
        Add Property
      </Button>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<PictureAsPdf />}
        onClick={generateReport}
        sx={{ mb: 2 }}
      >
        Report
      </Button>

      <Paper elevation={3}>
        <List>
          {filteredProperties.map((property) => (
            <ListItem key={property.id} secondaryAction={
              <>
                <IconButton onClick={() => handleOpenView(property)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleOpenEdit(property)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(property.id)}>
                  <Delete />
                </IconButton>
              </>
            }>
              <ListItemText 
                primary={property.name}
                secondary={
                  <>
                    <Typography component="span" display="block">
                      {property.location}
                    </Typography>
                    <Typography component="span" display="block">
                      ${property.price.toLocaleString()}
                    </Typography>
                    <Typography component="span" display="block" color={property.availability === "true" ? "success.main" : "error.main"}>
                      {property.availability === "true" ? "Available" : "Not Available"}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New Property</DialogTitle>
        <DialogContent>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the following errors:
              <ul>{Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}</ul>
            </Alert>
          )}
          <TextField margin="dense" name="name" label="Name" fullWidth value={newProperty.name} onChange={handleInputChange} error={!!errors.name} />
          <TextField margin="dense" name="location" label="Location" fullWidth value={newProperty.location} onChange={handleInputChange} error={!!errors.location} />
          <TextField margin="dense" name="price" label="Price" type="number" fullWidth value={newProperty.price} onChange={handleInputChange} error={!!errors.price} />
          <TextField margin="dense" name="description" label="Description" fullWidth multiline rows={3} value={newProperty.description} onChange={handleInputChange} error={!!errors.description} />
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Availability</FormLabel>
            <RadioGroup name="availability" value={newProperty.availability} onChange={handleInputChange}>
              <FormControlLabel value="true" control={<Radio />} label="Available" />
              <FormControlLabel value="false" control={<Radio />} label="Not Available" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setEditOpenDialog(false)}>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the following errors:
              <ul>{Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}</ul>
            </Alert>
          )}
          <TextField margin="dense" name="name" label="Name" fullWidth value={newProperty.name} onChange={handleInputChange} error={!!errors.name} />
          <TextField margin="dense" name="location" label="Location" fullWidth value={newProperty.location} onChange={handleInputChange} error={!!errors.location} />
          <TextField margin="dense" name="price" label="Price" type="number" fullWidth value={newProperty.price} onChange={handleInputChange} error={!!errors.price} />
          <TextField margin="dense" name="description" label="Description" fullWidth multiline rows={3} value={newProperty.description} onChange={handleInputChange} error={!!errors.description} />
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Availability</FormLabel>
            <RadioGroup name="availability" value={newProperty.availability} onChange={handleInputChange}>
              <FormControlLabel value="true" control={<Radio />} label="Available" />
              <FormControlLabel value="false" control={<Radio />} label="Not Available" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setViewOpenDialog(false)}>
        <DialogTitle>{selectedProperty?.name}</DialogTitle>
        <DialogContent>
          <Typography>Location: {selectedProperty?.location}</Typography>
          <Typography>Price: ${selectedProperty?.price.toLocaleString()}</Typography>
          <Typography>Description: {selectedProperty?.description}</Typography>
          <Typography>Availability: {selectedProperty?.availability === "true" ? "Available" : "Not Available"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyDashboard;