import React from "react";

function Explore() {
  return (
    <>
      <div className="max-w-7xl mx-auto  sm:px-6 ">
        <div className="">
          <div>
            Explore
            <p>Where do you want to help?</p>
          </div>
          <div>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-lime-400 transition duration-300">
              Price
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 gap-8 rounded-md hover:bg-lime-400 transition duration-300">
              Date
            </button>
            <button className="bg-lime-300 text-white px-4 py-2 rounded-md hover:bg-lime-400 transition duration-300">
              Show filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
