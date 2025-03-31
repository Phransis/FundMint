import React from "react";

const Test = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-md">
        <div className="text-2xl font-bold text-green-600">Fund</div>
        <ul className="flex space-x-6">
          <li>Home</li>
          <li>Donation</li>
          <li>How It Works</li>
          <li>About Us</li>
        </ul>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Download App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-100">
        <h1 className="text-5xl font-bold">
          Fund <span className="text-green-600">Help Others</span>
        </h1>
        <p className="mt-4 text-lg">
          Fundraise at lightning speed to make a difference.
        </p>
        <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg text-lg">
          Start Fundraising
        </button>
      </section>

      {/* Urgent Fundraising */}
      <section className="py-16 px-10">
        <h2 className="text-3xl font-bold mb-6">Urgent Fundraising!</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold">GreenFund: Sustain Earth Now</h3>
            <p>$50,240,210 raised | 7 days left</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold">
              SeniorHealth: Support Campaign
            </h3>
            <p>$4,240,310 raised | 19 days left</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold">DisasterCare: Urgent Support</h3>
            <p>$2,100,210 raised | 23 days left</p>
          </div>
        </div>
      </section>

      {/* Fundraiser Count */}
      <section className="text-center py-20 bg-gray-100">
        <h2 className="text-4xl font-bold">Be Part of 217,924+ Fundraisers</h2>
        <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg text-lg">
          Join Now
        </button>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-10">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <ul className="space-y-4">
          <li className="border-b pb-2">How Can I Make a Donation?</li>
          <li className="border-b pb-2">Is My Donation Tax-Deductible?</li>
          <li className="border-b pb-2">
            Can I Donate In Honor or Memory of Someone?
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-900 text-white">
        <p>&copy; FundInc. 2023 | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Test;
