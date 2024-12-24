import React, { useEffect } from "react";

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top
  }, []);

  return (
    <>
      <section className="mt-16  md:ml-72 ">
        <div className=" p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg ">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Effective Date: 21st December 2024
            </p>

            <div className="space-y-6 text-gray-700">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
                <p>
                  These Terms & Conditions govern your use of our website and
                  services. By accessing or using our services, you agree to
                  comply with these terms. Please read them carefully.
                </p>
              </section>

              {/* Use of the Website */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  2. Use of the Website
                </h2>
                <p>
                  You agree to use the website only for lawful purposes. You
                  must not use our services in any way that breaches any
                  applicable law or regulation or causes harm to others.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Do not misuse the services by interfering with their normal
                    operation.
                  </li>
                  <li>
                    You may not attempt to gain unauthorized access to our
                    systems.
                  </li>
                  <li>
                    Do not use the website to transmit any malware or harmful
                    software.
                  </li>
                </ul>
              </section>

              {/* Account Registration */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  3. Account Registration
                </h2>
                <p>
                  If you create an account with us, you must provide accurate
                  and complete information. You are responsible for maintaining
                  the confidentiality of your account credentials.
                </p>
                <p>
                  You agree to notify us immediately if there is any
                  unauthorized use of your account.
                </p>
              </section>

              {/* Payments and Refunds */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  4. Payments and Refunds
                </h2>
                <p>
                  All payments made through our website are processed securely.
                  Fees, charges, and any applicable taxes will be displayed
                  before you complete a purchase.
                </p>
                <p>
                  Refunds may be provided in accordance with our refund policy,
                  which is detailed separately.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  5. Intellectual Property
                </h2>
                <p>
                  All content on our website, including text, graphics, logos,
                  and software, is the property of our company. You are not
                  allowed to copy, modify, or distribute any part of our website
                  without permission.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  6. Limitation of Liability
                </h2>
                <p>
                  We are not responsible for any damages that arise from your
                  use of our website, including loss of data, profits, or
                  business. Our liability is limited to the extent permitted by
                  law.
                </p>
              </section>

              {/* Termination of Service */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  7. Termination of Service
                </h2>
                <p>
                  We reserve the right to terminate or suspend your access to
                  our website at any time if you breach these Terms & Conditions
                  or engage in unlawful activities.
                </p>
              </section>

              {/* Changes to the Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  8. Changes to the Terms
                </h2>
                <p>
                  We may update these Terms & Conditions from time to time. We
                  will notify you of significant changes by posting an update on
                  our website. Continued use of the website after changes are
                  made constitutes your acceptance of the new terms.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  9. Governing Law
                </h2>
                <p>
                  These Terms & Conditions are governed by and construed in
                  accordance with the laws of India. Any disputes
                  relating to these terms will be subject to the jurisdiction of
                  the courts in Gharuan.
                </p>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">10. Contact Us</h2>
                <p>
                  If you have any questions about these Terms & Conditions,
                  please contact us at{" "}
                  <a
                    href="mailto:info.ashopiy@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    info.ashopiy@gmail.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsConditions;
