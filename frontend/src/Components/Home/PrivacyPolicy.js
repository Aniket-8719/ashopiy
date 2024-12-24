import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top
  }, []);

  return (
    <>
    <section  className="mt-16 md:ml-72 ">
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white  rounded-lg ">
        <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
        <p className="text-gray-600 mb-6 text-center">Effective Date: 21st December 2024</p>

        <div className="space-y-6 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to our website. We are committed to protecting your privacy and ensuring that your personal information is secure. This Privacy Policy explains how we collect, use, and disclose information when you use our website and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Personal Information:</strong> such as your name, email address, phone number, and payment information.</li>
              <li><strong>Usage Information:</strong> such as your IP address, browser type, and activity on our website.</li>
              <li><strong>Cookies:</strong> to improve your experience on our site and analyze website traffic.</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process transactions and send you updates related to your orders.</li>
              <li>Respond to your inquiries and provide customer support.</li>
              <li>Analyze usage patterns and improve user experience.</li>
            </ul>
          </section>

          {/* Sharing of Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information with trusted partners for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Payment processing through secure third-party providers.</li>
              <li>Providing customer service through trusted service providers.</li>
              <li>Legal obligations, such as complying with court orders or legal processes.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
            <p>
              We implement robust security measures to protect your personal information from unauthorized access, disclosure, or misuse. However, please be aware that no method of online transmission is 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us at <a href="mailto:info.ashopiy@gmail.com" className="text-blue-600 hover:underline">info.ashopiy@gmail.com</a>.
            </p>
          </section>

          {/* Changes to the Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a notice on our website.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info.ashopiy@gmail.com" className="text-blue-600 hover:underline">info.ashopiy@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
    </section>
    </>
  );
};

export default PrivacyPolicy;
