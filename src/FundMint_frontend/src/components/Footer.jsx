import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-5 gap-4 ">
          <div>
            <p className="py-2">Home</p>
            <p>
              {" "}
              <Link to="favorites" className="text-gray-400">
                My Favorites{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="recents" className="text-gray-400">
                My Recents{" "}
              </Link>
            </p>
          </div>
          <div>
            <p className="py-2">Explore</p>
            <p>
              {" "}
              <Link to="lists" className="text-gray-400">
                Lists{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="maps" className="text-gray-400">
                Maps{" "}
              </Link>
            </p>{" "}
          </div>
          <div>
            <p className="py-2">Campaigns</p>
            <p>
              {" "}
              <Link to="/" className="text-gray-400">
                Home{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="campaigns" className="text-gray-400">
                Campaigns{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="donations" className="text-gray-400">
                Donations{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="analytics" className="text-gray-400">
                Analytics{" "}
              </Link>
            </p>
          </div>
          <div>
            Profile
            <p>
              {" "}
              <Link to="settings" className="text-gray-400">
                Settings{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="notifications" className="text-gray-400">
                Notifications{" "}
              </Link>
            </p>
          </div>
          <div>
            <p className="py-2">Resources</p>
            <p>
              {" "}
              <Link to="how-to" className="text-gray-400">
                How to use FundMint{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="docs" className="text-gray-400">
                Docs{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="legal-terms" className="text-gray-400">
                Legal Terms{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="blog" className="text-gray-400">
                Blog{" "}
              </Link>
            </p>
            <p>
              {" "}
              <Link to="merch" className="text-gray-400">
                Merch{" "}
              </Link>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 ">
          <div className="text-3xl font-bold text-lime-300">FundMint</div>
          <div></div>
          <div className="text-gray-400">
            © {new Date().getFullYear()} Made with love by{" "}
            <Link to="https://github.com/phransis" target="__blank">
              Handla
            </Link>
            , All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
