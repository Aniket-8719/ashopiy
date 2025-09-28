import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const plan = [
    {
      name: "Basic",
      description: "The best solution for your any type of businesses",
      price: 150,
      features: [
        "Manage daily Incomes",
        "Access to detailed sales reports with charts",
        "Udhar management",
        "Investments analysis",
        "Daily Income tracking",
        "Email support",
        "Download all data",
        "Excel support",
        "Cloud backups",
        "User-friendly dashboard",
        "Feature lock system",
        "Create an advanced shopping list",
      ],
    },
    {
      name: "Premium",
      description:
        "The best solution for your any type of businesses with advanced features",
      price: 1700, // Example price for premium plan
      features: [
        "Manage daily Incomes",
        "Access to detailed sales reports with charts",
        "Udhar management",
        "Investments analysis",
        "Daily Income tracking",
        "Email support",
        "Download all data",
        "Excel support",
        "Cloud backups",
        "User-friendly dashboard",
        "Feature lock system",
        "Create an advanced shopping list",
        "Better Team Support",
        "Advanced analytics",
      ],
    },
  ];

  const navigate = useNavigate();

  const handleGetStarted = (plan) => {
    navigate("/paymentSummary", {
      state: { planName: plan.name, price: plan.price },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <>
      <section className="mt-12 lg:mt-16 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
              Affordable Plans for Small Businesses
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get all the essential features to run your shop smoothly without
              any hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plan.map((pricingPlan, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Plan Header */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-center py-6 rounded-lg -mt-12 mx-4 mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {pricingPlan.name} Plan
                  </h3>
                  <p className="text-sm text-primary-100 mt-2">
                    {pricingPlan.description}
                  </p>
                </div>

                {/* Plan Body */}
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-neutral-800">
                    ₹{pricingPlan.price}
                  </span>
                  <span className="text-neutral-600">
                    /{pricingPlan.name.toLowerCase()}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {pricingPlan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                        <svg
                          className="w-3 h-3 text-success-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center">
                  <button
                    onClick={() => handleGetStarted(pricingPlan)}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </button>
                  <p className="mt-4 text-sm text-neutral-500">
                    No hidden fees · Cancel anytime
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <div className="bg-neutral-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Need help deciding?
              </h3>
              <p className="text-neutral-600">
                All plans include 24/7 support and a 14-day money-back
                guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
