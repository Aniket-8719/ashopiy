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
          <div className="flex flex-col gap-8 mt-16 md:mt-0 md:gap-0 md:flex-row items-center justify-between px-2 md:px-12 py-8 md:py-2 bg-gray-50 rounded-md ">
            {/* Text Section */}
            <div className="text-left w-full md:max-w-[70%] lg:max-w-[60%] px-2">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-700 leading-tight md:leading-snug">
                <span className=" text-amber-600 relative -top-[5px] md:-top-[7px] font-literata">
                  ashopiy
                </span>{" "}
                के साथ अब अपनी दैनिक आय का हिसाब रखना हुआ और भी आसान.
              </h1>
              <p className="text-gray-600 text-lg md:text-xl mt-4">
              Our platform simplifies managing your shop’s performance with the Sales & Analytics Dashboard, including 
              sales trends, investment, and earnings charts. Manage credit transactions effortlessly with Udhar Management. 
              </p>
              {/* <div className="flex justify-start items-center gap-8">
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
             </div> */}

              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to={"/pricing"}
                  className="bg-indigo-600 flex items-center justify-center text-white font-medium text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition"
                >
                  Join Now
                </Link>
                <Link to={"/video"} className="flex items-center justify-center gap-2 bg-white text-amber-600 font-medium text-lg px-6 py-3 rounded-lg  border border-amber-600 hover:bg-amber-600 hover:text-white transition focus:outline-none  focus:border-amber-500">
                  <FaCirclePlay className="" />
                  <button className="">Watch Video</button>
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-[30%] lg:w-[45%] mb-6 md:mb-0 ">
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
            <h2 className="text-3xl font-bold mb-8 text-gray-700">What We Provide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Real-Time Earning Management
                </h3>
                <p className="text-gray-700">
                Effortlessly monitor revenue performance, track investments, and manage your shop's 
                financial activities, including earnings and expenditures, all from a centralized platform.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Sales & Analytics Dashboard
                </h3>
                <p className="text-gray-700"> 
                Access various charts to track daily, monthly, and yearly sales trends. Download data in Excel format for easy analysis.

Visualize your shop’s financial health with dedicated investment and earnings line charts, helping you quickly 
identify whether your shop is operating at a profit or loss. Manage your business smarter with powerful, actionable insights.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Customer Tracking Made Easy
                </h3>
                <p className="text-gray-700">
                Monitor the number of customers visiting your shop daily and monthly. 
                Enhance engagement, track repeat visits, and build stronger 
                relationships with integrated management tools.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Udhar Management
                </h3>
                <p className="text-gray-700">
                Easily manage credit transactions for your shop. Track outstanding balances, 
                set reminders for repayments, and maintain accurate records to streamline your 
                udhar (credit) operations efficiently.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Smart Shopping List
                </h3>
                <p className="text-gray-700">
                Create and organize your shopping list with different units like kilograms (kg), grams (g), liters (l), milliliters (ml), and units. 
                Download your list in various formats such as Excel or PDF. 
                Forget the hassle of pen and paper—carry your list on your phone and easily share it with others in just a few clicks.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Advanced Lock System
                </h3>
                <p className="text-gray-700">
                Empower shop owners with full control over features and access. 
                Lock all functionalities and selectively unlock only the features you want your employees to use. 
                No need for extra accounts—simply log in to your employee’s device with your ID, and they will only have access to the unlocked features. 
                Locked features remain inaccessible until you decide to unlock them, ensuring maximum security and control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Will Provide in the Future */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-700">Future Features</h2>
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
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Attendance System
                </h3>
                <p className="text-gray-700">
                Implement a streamlined attendance management system to track employee attendance efficiently. 
                Easily mark attendance (Present, Absent, Leave, or Other) and maintain accurate records to improve workforce management.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                Billing System
                </h3>
                <p className="text-gray-700">
                Introduce a user-friendly billing solution to generate invoices quickly and accurately. 
                Simplify the checkout process, track transactions, and manage sales records, enhancing overall customer satisfaction and business operations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default Home;
