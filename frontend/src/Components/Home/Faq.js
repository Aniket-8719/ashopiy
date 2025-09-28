import React, { useState } from 'react';
import { faqs } from './data/pages_data';

const Faq = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };


  return (
  <>
  <section className='mt-16'>
  <div className="p-6">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-lg ">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full text-left text-lg font-medium text-gray-900 p-4 flex justify-between items-center"
              >
                {faq.question}
                <span className="text-blue-600">{openQuestion === index ? '-' : '+'}</span>
              </button>
              {openQuestion === index && (
                <div className="text-gray-700 p-4 bg-gray-50">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  </>
  );
};

export default Faq;
