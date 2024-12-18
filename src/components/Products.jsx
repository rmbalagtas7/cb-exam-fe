import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Modal, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';


export default function Products() {
  const [products, setProducts] = useState([]);
  const apiUrl = 'http://localhost:3000/api';
  const [productDetails, setProductDetails] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [newProduct, setNewProduct] = useState({ type: '', name: '', price: '' });
  const [deleteId, setDeleteId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      setSnackbarMessage('Error fetching products');
      setOpenSnackbar(true);
    }
  };

  // Fetch product by ID
  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${id}`);
      setProductDetails(response.data);
    } catch (error) {
      setSnackbarMessage('Product not found');
      setOpenSnackbar(true);
    }
  };

  // Fetch all product types
  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/productTypes`);
      setProductTypes(response.data);
    } catch (error) {
      setSnackbarMessage('Error fetching product types');
      setOpenSnackbar(true);
    }
  };

  // Add a new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/product`, newProduct);
      setSnackbarMessage('Product added successfully');
      setOpenSnackbar(true);
      setNewProduct({ type: '', name: '', price: '' });
      fetchAllProducts(); // Refresh the product list
      setOpenModal(false);
    } catch (error) {
      setSnackbarMessage('Error adding product');
      setOpenSnackbar(true);
    }
  };

  // Delete a product by ID
  const deleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/product/${deleteId}`);
      setSnackbarMessage('Product deleted successfully');
      setOpenSnackbar(true);
      setDeleteId('');
      fetchAllProducts(); // Refresh the product list
    } catch (error) {
      setSnackbarMessage('Error deleting product');
      setOpenSnackbar(true);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'type', headerName: 'Type', width: 180 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'price', headerName: 'Price', width: 150 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Product Management</Typography>

      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={fetchAllProducts}>All Products</Button>
          <Button variant="contained" onClick={fetchProductTypes}>Product Types</Button>
          <Button variant="contained" onClick={() => setOpenModal(true)}>Add Product</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                label="Product ID"
                fullWidth
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={() => fetchProductById(searchId)} sx={{ height: '100%' }}>Search</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Product Types Section */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>Product Types</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {productTypes.length > 0 ? (
            productTypes.map((type, index) => (
              <Box key={index} sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography>{type}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No product types available</Typography>
          )}
        </Box>
      </Box>

      {/* Product Details */}
      {productDetails && (
        <Box sx={{ marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">Product Details</Typography>
          <Typography variant="body1">ID: {productDetails.id}</Typography>
          <Typography variant="body1">Type: {productDetails.type}</Typography>
          <Typography variant="body1">Name: {productDetails.name}</Typography>
          <Typography variant="body1">Price: ${productDetails.price}</Typography>
        </Box>
      )}

      {/* Display All Products with DataGrid */}
      <Box sx={{ marginTop: 3 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Box>

      {/* Delete Product Form */}
      <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Delete Product</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                label="Product ID to Delete"
                fullWidth
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={deleteProduct} sx={{ height: '100%' }}>Delete</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add Product Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" gutterBottom>Add Product</Typography>
          <form onSubmit={addProduct}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Product Type"
                  fullWidth
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Product Name"
                  fullWidth
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Product Price"
                  type="number"
                  fullWidth
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </Grid>
            </Grid>
            <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>Add Product</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
