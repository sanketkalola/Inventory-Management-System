const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  ProductBarcode: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        // Convert number to string and check length and digits
        return /^\d{12}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid 12-digit barcode!`,
    },
  },
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
