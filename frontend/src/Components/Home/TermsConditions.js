import React, { useEffect } from "react";
import { termsConditionsData } from './data/pages_data';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="mt-20 lg:ml-72 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 lg:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-2">
              {termsConditionsData.title}
            </h1>
            <p className="text-neutral-600 text-sm">
              Effective Date: {termsConditionsData.effectiveDate}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {termsConditionsData.sections.map((section, index) => (
              <section key={index} className="border-b border-neutral-100 pb-6 last:border-b-0 last:pb-0">
                <h2 className="text-xl lg:text-2xl font-semibold text-neutral-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-lg mr-1 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-xl">{index + 1}.</span>
                  </div>
                  {section.title}
                </h2>
                
                <div className="text-neutral-700 leading-relaxed ml-9">
                  <p className="mb-4">{section.content}</p>
                  
                  {section.additionalContent && (
                    <p className="mb-4">{section.additionalContent}</p>
                  )}
                  
                  {section.list && (
                    <ul className="space-y-3 ml-4">
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-primary-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Legal Notice */}
          <div className="mt-8 p-4 bg-warning-50 rounded-lg border border-warning-100">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-warning-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-warning-800 font-semibold text-sm mb-1">Legal Notice</p>
                <p className="text-warning-700 text-sm">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;