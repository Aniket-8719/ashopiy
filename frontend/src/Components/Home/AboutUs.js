import React from "react";

const AboutUs = () => {
  return (
    <>
    <section className="mt-16 md:my-20 md:ml-72">
    <div className="bg-gray-50  flex flex-col justify-center items-center px-6 md:px-12">
      <div className="max-w-4xl text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          About <span className="text-amber-600">ashopiy</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mt-4">
          Empowering Shopkeepers to Take Control of Their Financial and Operational Challenges.
        </p>
      </div>

      {/* Content Section */}
      <div className="mt-12 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Who We Are
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Founded on <strong>01 December 2024</strong>, ashopiy is an ambitious startup driven by a passionate team of developers and market agents. Our mission is to simplify business management for shopkeepers by offering tailored solutions for financial tracking, revenue management, and operational challenges.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-8">
            Our Mission
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            At ashopiy, we understand the struggles faced by small and medium-sized shopkeepers in tracking their **revenue**, **investments**, and **udhaar (credit) lists**. Our platform is designed to empower shopkeepers with tools that make managing **daily, monthly, and yearly revenue** seamless and efficient. We aim to bring transparency, ease, and innovation to shopkeeping operations.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-8">
            Why Choose Us?
          </h2>
          <ul className="text-gray-600 mt-4 leading-relaxed list-disc list-inside">
            <li>
              A dedicated team committed to solving real challenges faced by shopkeepers.
            </li>
            <li>
              Intuitive tools for tracking revenue, investments, and financial health.
            </li>
            <li>
              Comprehensive insights for daily, monthly, and yearly performance.
            </li>
            <li>
              A focus on empowering small businesses to thrive in a competitive market.
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ashopiy. All rights reserved.
        </p>
      </div>
    </div>
    </section>
    </>
  );
};

export default AboutUs;
