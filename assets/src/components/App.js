import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "utils/Header";
import Home from "utils/Home";
import NotFound from "utils/NotFound";
import Login from "./accounts/Login";
import Profile from "./accounts/Profile";
import Register from "./accounts/Register";
import AddressDetails from "./forms/AddressDetails";
import BankDetails from "./forms/BankDetails";
import ContactDetails from "./forms/ContactDetails";
import JobDetails from "./forms/JobDetails";
import QualificationDetails from "./forms/QualificationDetails";
import Search from "./search/Search";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bank" element={<BankDetails />} />
          <Route path="contact" element={<ContactDetails />} />
          <Route path="job" element={<JobDetails />} />
          <Route path="address" element={<AddressDetails />} />
          <Route path="qualification" element={<QualificationDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
