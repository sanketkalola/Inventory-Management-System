import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://backend-5340.onrender.com/api/products", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(res)

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setProductData(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Fixed URL - added /products before /deleteproduct
      const response = await fetch("https://backend-5340.onrender.com/api/products/deleteproduct/${id}", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const deletedata = await response.json();
      console.log(deletedata);

      if (response.status === 422 || !deletedata) {
        console.log("Error deleting product");
        setError("Failed to delete product.");
      } else {
        console.log("Product deleted");
        getProducts(); // Refresh the product list
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className='container-fluid p-5'>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container-fluid p-5'>
      <h1>Products Inventory</h1>
      <div className='add_button mb-3'>
        <NavLink to="/insertproduct" className='btn btn-primary fs-5'> + Add New Product</NavLink>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="overflow-auto" style={{ maxHeight: "38rem" }}>
        <table className="table table-striped table-hover fs-5">
          <thead>
            <tr className="tr_color">
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Product Price</th>
              <th scope="col">Product Barcode</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {productData.length > 0 ? (
              productData.map((element, index) => (
                <tr key={element._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{element.ProductName}</td>
                  <td>{element.ProductPrice}</td>
                  <td>{element.ProductBarcode}</td>
                  <td>
                    <NavLink to={`/updateproduct/${element._id}`} className="btn btn-primary">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteProduct(element._id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No products found. <NavLink to="/insertproduct">Add your first product</NavLink>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}