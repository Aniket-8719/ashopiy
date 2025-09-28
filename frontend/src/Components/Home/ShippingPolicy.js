import React from 'react';
import { shippingPolicyData } from './data/pages_data';

const ShippingPolicy = () => {
  return (
    <section className="mt-20 lg:ml-72 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 lg:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="p-3 bg-warning-100 rounded-full inline-flex mb-4">
              <svg className="w-6 h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-2">
              {shippingPolicyData.title}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 text-neutral-700 leading-relaxed">
            {shippingPolicyData.content.map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-neutral-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-600 text-sm">
                This policy applies to our digital services only. We currently do not handle physical product shipments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingPolicy;