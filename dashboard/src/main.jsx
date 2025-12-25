import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import ContextApi from "./context/ContextApi.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./common/Layout.jsx";
import Cms from "./components/CmsPages/Cms.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Configuration from "./components/Configuration/Configuration.jsx";
import PaymentGateway from "./components/Configuration/PaymentGateway.jsx";
import Faqs from "./components/Faqs/Faqs.jsx";
import FaqAddition from "./components/Faqs/FaqAddition.jsx";
import Contact from "./components/Enquiry/Contact.jsx";
import Newsletter from "./components/Enquiry/NewsLetter.jsx";
import Admin from "./components/UserManagement/Admin.jsx";
import Users from "./components/UserManagement/Users.jsx";
import Countries from "./components/Location/Countries.jsx";
import Slider from "./components/MasterCatalogue/Slider.jsx";
import Coupoun from "./components/MasterCatalogue/Coupoun.jsx";
import Testimonial from "./components/MasterCatalogue/Testimonial.jsx";
import Choose from "./components/MasterCatalogue/Choose.jsx";
import SliderAddition from "./components/MasterCatalogue/FilterandAddition/Sliders/SliderAddition.jsx";
import TestimonialAddition from "./components/MasterCatalogue/FilterandAddition/Testimonial/TestimonialAddition.jsx";
import ChooseAddition from "./components/MasterCatalogue/FilterandAddition/Choose/ChooseAddition.jsx";
import CountryAddition from "./components/Location/Admin/CountryAddition.jsx";
import CoupounAddition from "./components/MasterCatalogue/FilterandAddition/Coupouns/CoupounsAddition.jsx";
import Colors from "./components/ProductCatalogue/Colors.jsx";
import Material from "./components/ProductCatalogue/Material.jsx";
import Category from "./components/ProductCatalogue/Categories.jsx";

import Product from "./components/ProductCatalogue/Product.jsx";
import MaterialAddition from "./components/ProductCatalogue/FilterandAddition/Material/MaterialAddition.jsx";
import SubCategory from "./components/ProductCatalogue/SubCategories.jsx";
import SubCategoryAddition from "./components/ProductCatalogue/FilterandAddition/SubCategories/SubCategoryAddition.jsx";
import SubSubCategory from "./components/ProductCatalogue/SubSubCategories.jsx";
import SubSubCategoryAddition from "./components/ProductCatalogue/FilterandAddition/SubSubCategories/SubSubCategoryAddition.jsx";
import ProductAddition from "./components/ProductCatalogue/FilterandAddition/Products/ProductAddition.jsx";
import CategoryAddition from "./components/ProductCatalogue/FilterandAddition/Categories/CategoryAddition.jsx";

createRoot(document.getElementById("root")).render(
 
    <ContextApi>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/cms" element={<Cms />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/paymentgateway" element={<PaymentGateway />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/faqaddition" element={<FaqAddition />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<Users />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/slider" element={<Slider />} />
            <Route path="/coupoun" element={<Coupoun />} />
            <Route path="/coupounaddition" element={<CoupounAddition />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/choose" element={<Choose />} />
            <Route path="/chooseaddition" element={<ChooseAddition />} />
            <Route path="/slideraddition" element={<SliderAddition />} />
            <Route path="/testimonialaddition" element={<TestimonialAddition />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/material" element={<Material />} />
            <Route path="/category" element={<Category />} />
            <Route path="/categoryaddition" element={<CategoryAddition />} />
            <Route path="/category/update/:id?" element={<CategoryAddition />} />
            <Route path="/product" element={<Product />} />
            <Route path="/productaddition" element={<ProductAddition />} />
            <Route path="/materialaddition" element={<MaterialAddition />} />
            <Route path="/subcategory" element={<SubCategory />} />
            <Route path="/subcategory/update/:id" element={<SubCategory />} />
            <Route path="/subcategoryaddition" element={<SubCategoryAddition />} />
            <Route path="/subsubcategory" element={<SubSubCategory />} />
            <Route path="/subsubcategory/update/:id" element={<SubSubCategory />} />
            <Route path="/subsubcategoryaddition" element={<SubSubCategoryAddition />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextApi>
 
);
