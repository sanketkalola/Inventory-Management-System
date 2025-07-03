import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`https://backend-mykt.onrender.com/api/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        setProductName(data.ProductName || "");
        setProductPrice(data.ProductPrice || "");
        setProductBarcode(data.ProductBarcode || "");

        console.log("Data Retrieved.");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product data.");
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://backend-mykt.onrender.com/api/updateproduct/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Parse JSON only if content exists
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        await response.json();
      }

      alert("Data Updated");
      navigate('/products');
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper input handlers
  const setName = (e) => setProductName(e.target.value);

  const setPrice = (e) => setProductPrice(e.target.value);

  const setBarcode = (e) => {
    // Limit barcode length to 12 characters, and allow only digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setProductBarcode(value);
  };

  return (
    <div className='container-fluid p-5'>
      <h1>Enter Product Information</h1>
      <form onSubmit={updateProduct} className="mt-5 col-lg-6 col-md-6 col-12">

        <label htmlFor="product_name" className="form-label fs-4 fw-bold">Product Name</label>
        <input
          type="text"
          onChange={setName}
          value={productName}
          className="form-control fs-5"
          id="product_name"
          placeholder="Enter Product Name"
          required
        />

        <label htmlFor="product_price" className="form-label fs-4 fw-bold mt-3">Product Price</label>
        <input
          type="number"
          onChange={setPrice}
          value={productPrice}
          className="form-control fs-5"
          id="product_price"
          placeholder="Enter Product Price"
          required
          min="0"
          step="0.01"
        />

        <label htmlFor="product_barcode" className="form-label fs-4 fw-bold mt-3">Product Barcode</label>
        <input
          type="text"
          onChange={setBarcode}
          value={productBarcode}
          className="form-control fs-5"
          id="product_barcode"
          placeholder="Enter Product Barcode"
          maxLength={12}
          required
          inputMode="numeric"
          pattern="\d*"
        />

        <div className='d-flex justify-content-center mt-4'>
          <NavLink to="/products" className='btn btn-secondary me-3 fs-5'>Cancel</NavLink>
          <button type="submit" className="btn btn-primary fs-5" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>

        {error && (
          <div className="text-danger mt-3 fs-5 fw-bold text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
