import { useState } from 'react';

const Pricing = () => {
  // State to toggle between monthly and yearly plans
  const [isYearly, setIsYearly] = useState(false);

  // Pricing data for both monthly and yearly plans
  const pricingPlans = [
    {
      name: 'Basic',
      description: 'Perfect for small shops',
      monthlyPrice: 19,
      yearlyPrice: 199,
      features: ['Up to 1,000 products', 'Basic analytics', 'Email support'],
    },
    {
      name: 'Pro',
      description: 'Best for growing businesses',
      monthlyPrice: 39,
      yearlyPrice: 399,
      features: ['Up to 5,000 products', 'Advanced analytics', 'Priority support'],
    },
    {
      name: 'Enterprise',
      description: 'Advanced solutions for big businesses',
      monthlyPrice: 99,
      yearlyPrice: 999,
      features: ['Unlimited products', 'Custom analytics', '24/7 support'],
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600">Flexible pricing plans for every business</p>
        
        {/* Toggle Switch */}
        <div className="mt-6 flex justify-center items-center">
          <span className="text-gray-700 font-medium mr-3">Monthly</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-gray-700 font-medium ml-3">Yearly</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {isYearly ? 'Save 20% with yearly billing!' : 'Billed monthly.'}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
            <div className="flex items-end mb-6">
              <span className="text-4xl font-bold text-gray-800">
                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </span>
              <span className="text-gray-500 ml-2">
                / {isYearly ? 'year' : 'month'}
              </span>
            </div>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2"
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
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
