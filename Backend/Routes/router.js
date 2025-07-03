const express = require('express');
const router = express.Router();
const products = require('../Models/Products');

// Create a product
router.post("api/products/insertproduct", async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode } = req.body;
    if (!ProductName || !ProductPrice || !ProductBarcode) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingProduct = await products.findOne({ ProductBarcode });
        if (existingProduct) {
            return res.status(422).json({ error: "Product is already added." });
        }
        const newProduct = new products({ ProductName, ProductPrice, ProductBarcode });
        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const getProducts = await products.find({});
        return res.status(200).json(getProducts);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const getProduct = await products.findById(req.params.id);
        if (!getProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(getProduct);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Update product by ID
router.put('/products/updateproduct/:id', async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode } = req.body;
    if (!ProductName || !ProductPrice || !ProductBarcode) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const updatedProduct = await products.findByIdAndUpdate(
            req.params.id,
            { ProductName, ProductPrice, ProductBarcode },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Delete product by ID
router.delete('/products/deleteproduct/:id', async (req, res) => {
    try {
        const deletedProduct = await products.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(deletedProduct);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;