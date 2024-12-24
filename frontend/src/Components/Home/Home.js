import React from "react";
import heroImg from "../assests/generated-image.png";
import { FaCirclePlay } from "react-icons/fa6";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import FAQ from "./Faq";

const Home = () => {
  return (
    <>
      <div className="mt-12 md:mt-16 md:ml-72">
        {/* Main Hero Section */}
        <section className="">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between px-2 md:px-12 py-8 md:py-2 bg-gray-50 rounded-md ">
            {/* Text Section */}
            <div className="text-left w-full md:max-w-[50%] lg:max-w-[45%] px-2">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug md:leading-normal mb-6 text-gray-900 ">
             <span className="text-2xl sm:text-3xl md:text-5xl text-amber-500 mr-2 md:mr-4 ">ashopiy</span>  के साथ अब अपनी दैनिक आय का हिसाब रखना हुआ और भी आसान.
              </h1>
              <p className="text-sm sm:text-md md:text-lg mb-6 text-gray-600">
                Our platform is designed to simplify how you manage your
                inventory, track sales, and grow your business.
              </p>
             <div className="flex justify-start items-center gap-8">
            <Link to={"/pricing"}>
            <button className="text-white  bg-amber-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-amber-700 transition-all">
                Join Us Today
              </button>
            </Link>
              <div className="flex items-center justify-self-center gap-2 p-4 py-3 px-6 rounded-full shadow-lg hover:bg-blue-900 transition-all text-white  bg-blue-600 font-bold ">
                <FaCirclePlay className=""/>
              <button className="">
                Watch Video
              </button>
              </div>
             </div>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-[50%] lg:w-[45%] mb-6 md:mb-0 ">
              <img
                src={heroImg}
                alt="Shop Management Banner"
                className="w-full  rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Vision and Mission Section */}
        {/* <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold mb-8">Our Vision & Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  To empower shopkeepers with cutting-edge technology that
                  enables seamless inventory management and growth, ensuring
                  every store operates at peak efficiency.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To provide an intuitive platform that simplifies the
                  day-to-day operations of shops by leveraging technology and
                  real-time data, enabling businesses to focus on growth rather
                  than management.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* What We Provide Now */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold mb-8">What We Provide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Real-Time Inventory Management
                </h3>
                <p className="text-gray-700">
                  Easily track stock levels, monitor sales trends, and manage
                  your shop’s inventory from one place.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Sales & Analytics Dashboard
                </h3>
                <p className="text-gray-700">
                  Understand your sales performance with in-depth reports and
                  insights that help you make data-driven decisions.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Customer Relationship Tools
                </h3>
                <p className="text-gray-700">
                  Engage with your customers, track repeat visits, and manage
                  your relationships better with built-in tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Will Provide in the Future */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold mb-8">Future Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  AI-Powered Demand Forecasting
                </h3>
                <p className="text-gray-700">
                  Coming soon: Use predictive algorithms to forecast product
                  demand and optimize stock levels to prevent overstocking or
                  running out of items.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Multi-Store Management
                </h3>
                <p className="text-gray-700">
                  Manage multiple shops from a single dashboard, providing a
                  comprehensive view of performance across locations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FAQ/>
        <Footer/>
      </div>
    </>
  );
};

export default Home;
