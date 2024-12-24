import { useEffect } from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
    const plan = {
      name: 'Basic',
      description: 'The best solution for small or medium businesses',
      price: 100,
      features: [
        'Manage daily Incomes',
        'Access to detailed sales reports with charts',
        'Udhar management',
        'Investments analysis',
        'Daily Income tracking',
        'Email support',
        'Download all data',
        'Excel support',
        'Cloud backups',
        'User-friendly dashboard',
      ],
      specialOffer: 'First 14 days free!',
    };

    useEffect(() => {
      window.scrollTo(0, 0);  // Scroll to the top
    }, []);
  
  
    return (
      <>
      <section className="mt-14 md:mt-18  md:ml-72">
      <div className="py-12">
        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center  max-w-6xl mx-auto w-full px-6 md:px-0 ">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Affordable Pricing for Small Shops</h2>
            <p className="text-xl mb-6">Get all the essential features to run your shop smoothly.</p>
            {/* <p className="text-sm text-gray-900">{plan.specialOffer}</p> */}
          </div>
  
          {/* Pricing Card */}
          <div className="max-w-md mx-auto bg-white text-gray-800 w-full shadow-2xl rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-center py-6">
              <h3 className="text-2xl font-semibold text-white">{plan.name} Plan</h3>
              <p className="text-sm mt-2 text-white">{plan.description}</p>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-5xl font-bold">₹{plan.price}</span>
                <span className="text-gray-600 text-xl">/ month</span>
              </div>
  
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
  
              <div className="text-center">
                <Link to={"/paymentSummary"}>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                  Get Started
                </button>
                </Link>
                <p className="mt-4 text-sm text-gray-500">No credit card required.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      </section>
      </>
    );
  };
  
  export default Pricing;
  