import { useEffect } from 'react';
import { privacyPolicyData } from './data/pages_data';

const PrivacyPolicy = () => {
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
              {privacyPolicyData.title}
            </h1>
            <p className="text-neutral-600 text-sm">
              Effective Date: {privacyPolicyData.effectiveDate}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {privacyPolicyData.sections.map((section, index) => (
              <section key={index} className="border-b border-neutral-100 pb-6 last:border-b-0 last:pb-0">
                <h2 className="text-xl lg:text-2xl font-semibold text-neutral-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-lg mr-1 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-xl">{index + 1}.</span>
                  </div>
                  {section.title}
                </h2>
                
                <div className="text-neutral-700 leading-relaxed">
                  <p className="mb-4">{section.content}</p>
                  
                  {section.list && (
                    <ul className="space-y-2 ml-4">
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary-200 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {item.type === 'strong' ? (
                            <span className="font-semibold text-neutral-800">{item.text}</span>
                          ) : (
                            <span>{item.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-primary-800 text-sm text-center">
              For any privacy-related concerns, contact us at{' '}
              <a 
                href="mailto:info.ashopiy@gmail.com" 
                className="font-semibold hover:text-primary-900 transition-colors"
              >
                info.ashopiy@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;