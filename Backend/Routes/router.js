const express = require('express');
const router = express.Router();
const products = require('../Models/Products');

// Inserting (Creating) Data
router.post("/insertproduct", async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode } = req.body;
    console.log("Request Body:", req.body);

    if (!ProductName || !ProductPrice || !ProductBarcode) {
        console.log("Missing fields");
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingProduct = await products.findOne({ ProductBarcode });
        console.log("Existing Product?", existingProduct);

        if (existingProduct) {
            return res.status(422).json({ error: "Product is already added." });
        }

        const newProduct = new products({ ProductName, ProductPrice, ProductBarcode });
        await newProduct.save();
        console.log("Product Inserted:", newProduct);

        return res.status(201).json(newProduct);
    } catch (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Getting (Reading) All Products
router.get('/', async (req, res) => {
    try {
        const getProducts = await products.find({});
        console.log("All Products:", getProducts);

        return res.status(200).json(getProducts);
    } catch (err) {
        console.error("Fetch Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Getting (Reading) Individual Product by ID
router.get('/:id', async (req, res) => {
    try {
        const getProduct = await products.findById(req.params.id);

        if (!getProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log("Product Found:", getProduct);
        return res.status(200).json(getProduct);
    } catch (err) {
        console.error("Fetch One Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Editing (Updating) Product
router.put('/updateproduct/:id', async (req, res) => {
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

        console.log("Product Updated:", updatedProduct);
        return res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Deleting Product
router.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const deletedProduct = await products.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log("Product Deleted:", deletedProduct);
        return res.status(200).json(deletedProduct);
    } catch (err) {
        console.error("Delete Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
