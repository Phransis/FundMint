import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FundMint_backend } from "declarations/FundMint_backend";

export default function App() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const data = await FundMint_backend.getCampaigns();
        setCampaigns(data.slice(0, 3)); // Display top 3 campaigns
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center h-screen bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          FundMint - AI NFT Crowdfunding
        </motion.h1>
        <p className="text-lg mt-4 max-w-2xl text-gray-300">
          Fund projects, generate AI-powered NFTs, and shape the future on ICP.
        </p>
        <Link to="/dashboard" className="mt-6 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition">
          Get Started
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-16 px-8 md:px-16 lg:px-32 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Start a Campaign</h3>
            <p className="text-gray-400">Launch your project and set a funding goal.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Contribute & Mint</h3>
            <p className="text-gray-400">Support campaigns and receive unique AI NFTs.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Withdraw or Reinvest</h3>
            <p className="text-gray-400">Withdraw funds when goals are met or support other projects.</p>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 px-8 md:px-16 lg:px-32">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.length > 0 ? (
            campaigns.map((campaign, idx) => (
              <div key={idx} className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">{campaign.name}</h3>
                <p className="text-gray-400">Goal: {Number(campaign.target).toLocaleString()} ICP</p>
                <p className="text-gray-400">Raised: {Number(campaign.raised).toLocaleString()} ICP</p>
                <Link to={`/campaign/${campaign.id}`} className="mt-4 block text-blue-400 hover:underline">
                  View Campaign
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No campaigns found.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gray-900">
        <h2 className="text-3xl font-bold">Ready to Fund or Launch a Campaign?</h2>
        <Link to="/dashboard" className="mt-6 inline-block px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition">
          Get Started
        </Link>
      </section>
    </div>
  );
}
