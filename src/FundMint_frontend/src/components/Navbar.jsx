import { useEffect, useState } from "react";
// import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ic?.plug) {
      alert("Plug Wallet is not installed!");
      // Optionally redirect to Plug's website
      window.open("https://plugwallet.ooo/", "_blank");
    }
    setLoading(true);
    setError(null);
    try {
      const principal = await window.ic.plug.requestConnect();
      console.log(`The connected user's principal is:`, principal);

      setAddress(principal.toString());
      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  // const disconnectWallet = () => {
  //   setAddress('');
  //   setBalance(null);
  // }
  // const handleConnectClick = () => {
  //   if (address) {
  //     disconnectWallet();
  //   } else {
  //     connectWallet();
  //   }
  // }
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // connectWallet();
  }, []);
  // return (
  //   <div>
  //     <NavbarComponent
  //       isOpen={isOpen}
  //       toggleMenu={toggleMenu}
  //       address={address}
  //       balance={balance}
  //       loading={loading}
  //       error={error}
  //       handleConnectClick={handleConnectClick}
  //     />
  //   </div>
  // );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-lime-300">FundMint</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a
              href="/"
              className="text-gray-700 hover:text-lime-300 transition duration-300"
            >
              Home
            </a>
            <a
              href="campaigns"
              className="text-gray-700 hover:text-lime-300 transition duration-300"
            >
              Campaigns
            </a>
            <a
              href="about"
              className="text-gray-700 hover:text-lime-300 transition duration-300"
            >
              About
            </a>
            <a
              href="contact"
              className="text-gray-700 hover:text-lime-300 transition duration-300"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="bg-lime-300 text-black px-4 py-2 rounded-lg hover:bg-lime-500 transition duration-300"
              onClick={connectWallet}
            >
              {loading
                ? "Connecting..."
                : address
                ? `Connected: ${address.slice(0, 6)}...`
                : "Connect Wallet"}
              {/* {address} */}
            </button>
            <button className="md:hidden" onClick={toggleMenu}>
              {isOpen ? (
                <div className="w-6 h-6 text-gray-700" />
              ) : (
                <div className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white p-4 space-y-2">
          <a
            href="#home"
            className="block text-gray-700 hover:text-lime-300 transition duration-300"
          >
            Home
          </a>
          <a
            href="#campaigns"
            className="block text-gray-700 hover:text-lime-300 transition duration-300"
          >
            Campaigns
          </a>
          <a
            href="#about"
            className="block text-gray-700 hover:text-lime-300 transition duration-300"
          >
            About
          </a>
          <a
            href="#contact"
            className="block text-gray-700 hover:text-lime-300 transition duration-300"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
