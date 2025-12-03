import React from "react";

function Explore() {
  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 ">
        <div className="flex items-start justify-between w-full mt-6 px-4">
          {/* Left side: Explore and subtext */}
          <div className="flex flex-col">
            <span className="text-xxl font-semibold">Explore</span>
            <p className="text-xl text-gray-600">Where do you want to help?</p>
          </div>

          {/* Right side: Buttons */}
          <div className="flex ">
            <button className="border-gray-300 text-black px-4 py-2 rounded-md rounded-tr-none rounded-br-none  hover:bg-lime-400 transition duration-300">
              Price
            </button>
            <button className="border-gray-300 text-black px-4 py-2 rounded-md rounded-tl-none rounded-bl-none  hover:bg-lime-400 transition duration-300">
              Date
            </button>
            <button className="space-x-4 bg-lime-300 text-white px-4 py-2 rounded-md hover:bg-lime-400 transition duration-300">
              Show filters
            </button>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="flex items-start justify-between w-full mt-6 px-4">
          {/* Left side: Explore and subtext */}
          <div className="flex flex-col">
            <span className="text-xxl font-semibold">Explore</span>
            <p className="text-xl text-gray-600">Where do you want to help?</p>
          </div>

          {/* Right side: Buttons */}
          <div className="flex ">
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md rounded-md rounded-tr-none rounded-br-none hover:bg-lime-400 transition duration-300">
              Date
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md rounded-md rounded-tl-none rounded-bl-none hover:bg-lime-400 transition duration-300">
              Price
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
