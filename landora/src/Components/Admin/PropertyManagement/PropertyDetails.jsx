import React, { useState } from "react";
import { properties } from "../Database/Data";
import { Container, Typography, List, ListItem, ListItemText, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PropertyDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [openEditDialog, setEditOpenDialog] = useState(false);
    const [openViewDialog, setViewOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [propertyList, setPropertyList] = useState(properties);

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setViewOpenDialog(true);
        setEditMode(false);
    };

    const handleEditProperty = (property) => {
        setSelectedProperty(property);
        setEditOpenDialog(true);
        setEditMode(true);
    };

    const handleDeleteProperty = (propertyId) => {
        setPropertyList(propertyList.filter(property => property.id !== propertyId));
    };

    const handleSaveProperty = () => {
        setPropertyList(propertyList.map(property => 
            property.id === selectedProperty.id ? selectedProperty : property
        ));
        setEditOpenDialog(false);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text("Property Report", 14, 20);

        const tableColumn = ["Name", "Location", "Price", "Description", "Availability"];
        const tableRows = propertyList.map((property) => [
            property.name || property.title, 
            property.location, 
            property.price, 
            property.description, 
            property.availability ? "Available" : "Not Available"
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("Property_report.pdf");
    };

    const filteredProperties = propertyList.filter(property =>
        (property.name || property.title).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Property Listings Landora
            </Typography>
            <TextField
                label="Search by Property Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="secondary"
                startIcon={<PictureAsPdfIcon />}
                onClick={generateReport}
                style={{ marginBottom: "10px" }}
            >
                Generate Report
            </Button>
            <List>
                {filteredProperties.map(property => (
                    <Paper key={property.id} elevation={3} style={{ margin: "10px 0", padding: "10px" }}>
                        <ListItem>
                            <ListItemText
                                primary={<Typography variant="h6">{property.name || property.title}</Typography>}
                                secondary={
                                    <>
                                        <Typography variant="body2">Location: {property.location}</Typography>
                                        <Typography variant="body2">Price: {property.price}</Typography>
                                        <Typography variant="body2">Description: {property.description}</Typography>
                                    </>
                                }
                            />
                            <IconButton color="primary" size="medium" onClick={() => handleViewProperty(property)}>
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton color="success" size="medium" onClick={() => handleEditProperty(property)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" size="medium" onClick={() => handleDeleteProperty(property.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    </Paper>
                ))}
            </List>

            {/* View Property Dialog */}
            <Dialog open={openViewDialog && !editMode} onClose={() => setViewOpenDialog(false)}>
                <DialogTitle>Property Details</DialogTitle>
                <DialogContent>
                    {selectedProperty && (
                        <div>
                            <Typography variant="h6" gutterBottom><strong>Title:</strong> {selectedProperty.name || selectedProperty.title}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Location:</strong> {selectedProperty.location}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Price:</strong> {selectedProperty.price}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Buyer ID:</strong> {selectedProperty.buyerID || 'N/A'}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Vendor ID:</strong> {selectedProperty.vendorID || 'N/A'}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Description:</strong> {selectedProperty.description}</Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpenDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Property Dialog */}
            <Dialog open={openEditDialog} onClose={() => setEditOpenDialog(false)}>
                <DialogTitle>Edit Property</DialogTitle>
                <DialogContent>
                    {selectedProperty && (
                        <>
                            <TextField
                                label="Title"
                                value={selectedProperty.name || selectedProperty.title}
                                onChange={(e) => setSelectedProperty({ 
                                    ...selectedProperty, 
                                    name: e.target.value,
                                    title: e.target.value 
                                })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Location"
                                value={selectedProperty.location}
                                onChange={(e) => setSelectedProperty({ 
                                    ...selectedProperty, 
                                    location: e.target.value 
                                })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                value={selectedProperty.price}
                                onChange={(e) => setSelectedProperty({ 
                                    ...selectedProperty, 
                                    price: e.target.value 
                                })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                value={selectedProperty.description}
                                onChange={(e) => setSelectedProperty({ 
                                    ...selectedProperty, 
                                    description: e.target.value 
                                })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Avalability"
                                value={selectedProperty.availability}
                                onChange={(e) => setSelectedProperty({ 
                                    ...selectedProperty, 
                                    description: e.target.value 
                                })}
                                fullWidth
                                margin="normal"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveProperty} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PropertyDashboard;