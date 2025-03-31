import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FundMint_backend } from "declarations/FundMint_backend";
import TwoHands from "../assets/two-hands.jpg"; // Ensure this path is correct
import CampaignCard from "../components/CampaignCard";

export default function HomePage() {
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
    <div className="py-16 px-8 md:px-16 lg:px-32">
      <div className=" mx-auto">
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center justify-center text-center h-screen rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${TwoHands})` }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            FundMint - AI NFT Crowdfunding
          </motion.h1>
          <p className="text-lg mt-4 max-w-2xl text-black">
            Fund projects, generate AI-powered NFTs, and shape the future on
            ICP.
          </p>
          <Link
            to="/test"
            className="mt-6 px-6 py-3 bg-lime-300 rounded-xl hover:bg-lime-500 transition"
          >
            Get Started
          </Link>
        </section>
        <section>
          <div className="  py-16 px-8 md:px-16 lg:px-32 ">
            <h2 className="text-3xl font-bold  text- ">
              Fund Fast As <i>Flash</i>
            </h2>
            <p className="text-gray-400">
              Fundraise at the speed of thought! Elevate your cause in just a
              minute with our lightning-fast fundraising platform
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-8 md:px-16 lg:px-32 ">
          <h2 className="text-3xl font-bold text-center  mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-8 text-center">
            <div className="p-6  rounded-lg shadow-lg hover:bg-gray-100">
              <h3 className="text-xl font-semibold">Start a Campaign</h3>
              <p className="text-gray-400">
                Launch your project and set a funding goal.
              </p>
            </div>
            <div className="p-6  rounded-lg shadow-lg hover:bg-gray-100">
              <h3 className="text-xl font-semibold">Contribute & Mint</h3>
              <p className="text-gray-400">
                Support campaigns and receive unique AI NFTs.
              </p>
            </div>
            <div className="p-6  rounded-lg shadow-lg hover:bg-gray-100">
              <h3 className="text-xl font-semibold">Withdraw or Reinvest</h3>
              <p className="text-gray-400">
                Withdraw funds when goals are met or support other projects.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <section className="py-16 px-8 md:px-16 lg:px-32">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Campaigns
          </h2>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.length > 0 ? (
              campaigns.map((campaign, idx) => (
                <div key={idx} className="p-6 shadow-lg hover:bg-gray-100">
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <p className="text-gray-400">
                    Goal: {Number(campaign.target).toLocaleString()} ICP
                  </p>
                  <p className="text-gray-400">
                    Raised: {Number(campaign.raised).toLocaleString()} ICP
                  </p>
                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="mt-4 block text-blue-400 hover:underline"
                  >
                    View Campaign
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No campaigns found.</p>
            )}
          </div> */}
        </section>
        <section>
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {campaigns.map((campaign, idx) => (
                <CampaignCard
                  key={idx}
                  campaign={{
                    title: campaign.title,
                    goal: Number(campaign.target).toLocaleString(),
                    raised: Number(campaign.raised).toLocaleString(),
                    deadline: new Date(
                      Number(campaign.deadline) * 1000
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                    description: campaign.description,
                    imageUrl: { TwoHands },
                    id: campaign.id,
                    
                  }}
                />
              ))}
            </div>
          ): (
              <p className="text-center text-gray-400">No campaigns found.</p>
            )}
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 md:px-16 lg:px-32 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>
          <div className="flex flex-col items-center">
            <p className="text-lg max-w-2xl text-center">
              "FundMint has revolutionized the way we fund our projects. The AI
              NFTs are a game-changer!"
            </p>
            <p className="mt-4 text-gray-500">- Happy User</p>
          </div>
          <div className="flex flex-col items-center mt-8">
            <p className="text-lg max-w-2xl text-center">
              "The platform is user-friendly and the community is amazing. I
              highly recommend it!"
            </p>
            <p className="mt-4 text-gray-500">- Happy User</p>
          </div>
          <div className="flex flex-col items-center mt-8">
            <p className="text-lg max-w-2xl text-center">
              "FundMint has made fundraising so much easier. The AI-generated
              NFTs are a unique touch!"
            </p>
            <p className="mt-4 text-gray-500">- Happy User</p>
          </div>
          <div className="flex flex-col items-center mt-8">
            <p className="text-lg max-w-2xl text-center">
              "I love how FundMint combines crowdfunding with AI technology.
              It's a win-win!"
            </p>
            <p className="mt-4 text-gray-500">- Happy User</p>
          </div>
        </section>
        {/* FAQ */}
        <section className="py-16 px-8 md:px-16 lg:px-32">
          <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">What is FundMint?</h3>
              <p className="text-gray-400">
                FundMint is a crowdfunding platform that allows you to fund
                projects and receive AI-generated NFTs in return.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                How do I start a campaign?
              </h3>
              <p className="text-gray-400">
                Simply sign up, create your campaign, set a funding goal, and
                share it with your network.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-blue-400 hover:underline">
              View All FAQs
            </Link>
          </div>
        </section>
        {/* Contact Us */}

        {/* Call to Action */}
        <section className="text-center py-16 px-8 md:px-16 lg:px-32 bg-gray-100">
          <h2 className="text-3xl font-bold">
            Ready to Fund or Launch a Campaign?
          </h2>
          {/* <Link
            to="/dashboard"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            Get Started
          </Link> */}
          <h2 className="text-3xl font-bold">Join the FundMint Community</h2>
          <p className="mt-4 text-lg">
            Stay updated with the latest news and campaigns. Follow us on social
            media!
          </p>
          <div className="flex justify-center mt-6 space-x-4">
            <a
              href="https://twitter.com/FundMint"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/FundMint"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Discord
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
