import React, { useState } from 'react';

const Faq = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is the purpose of this platform?',
      answer: 'Our platform is designed to help shopkeepers and small, medium & large business owners manage their Investments, track earnings, and improve their overall business operations.',
    },
    {
      question: 'How do I sign up for a plan?',
      answer: 'You can sign up for a plan by navigating to the pricing section, choosing a suitable plan, and following the steps to complete your registration.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, UPI, and other payment gateways through Razorpay. All transactions are secure and encrypted.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Currently, we are offering free access to our platform until February 27th as a special benefit for new users. While we do not typically provide a free trial, our platform is designed with budget-friendly pricing to ensure accessibility for shopkeepers of all sizes, whether managing a small business or a larger operation.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team by emailing info.ashopiy@gmail.com or using the live chat feature on our whatsApp No. We are here to help 24/.',
    },
  ];

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
