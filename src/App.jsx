// import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ContactUs from "./pages/Contact-Us";
import Landing from "./pages/Landing";
import ProductProvider from "./context/Products/ProductProvider";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/AddProduct"
import 'sweetalert2/dist/sweetalert2.min.css';
import './App.css';

function App() {

  return (

          <ProductProvider>
            <div>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/ProductPage" element={<ProductPage />} />
                <Route path="/ContactUs" element={<ContactUs />} />
                <Route path="/Admin" element={<AdminPortal />} />
                <Route path="/AddProduct" element={<AddProduct />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ProductProvider>
  );
}

export default App;



