import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CampaignDetails from "./Pages/CampaignDetails";
import Campaigns from "./Pages/Campaigns";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Pages/HomePage";
import Layout from "./Layout/Layout";
import CreateCampaign from "./Pages/CreateCampaign";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />

            <Route path="*" element={<div>Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
