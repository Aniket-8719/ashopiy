// FeaturesSection.jsx
import React from 'react';

// Import data
import { currentFeatures, futureFeatures } from './data';

const FeaturesSection = () => {
  return (
    <>
      {/* Current Features */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What We Provide</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your shop management and boost your business growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-50 group hover:border-blue-100"
              >
                <div className="mb-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exciting new features we're developing to make your shop management even more powerful
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 group hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Coming Soon
                </div>
                <div className="mb-5 text-blue-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;