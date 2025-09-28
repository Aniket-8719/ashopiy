import { useEffect, useState } from "react";
import { clearError, contactUs } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { CONTACTUS_RESET } from "../../constants/userConstants";
import {
  FaComments,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPaperPlane,
  FaComment,
  // FaFacebookF,
  // FaTwitter,
  // FaLinkedinIn,
  // FaInstagram,
} from "react-icons/fa";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { loading, error, isEmailSent } = useSelector(
    (state) => state.contactUsMessage
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(contactUs(formData));
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError);
    }
    if (isEmailSent) {
      toast.success("Email sent successfully");
      dispatch({ type: CONTACTUS_RESET });
      // Reset the form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  }, [dispatch, error, isEmailSent]);

  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help you succeed
              with ashopiy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaComments className="text-primary-600 text-xl" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-neutral-600 leading-relaxed">
                  Our team is ready to assist you with any questions about our
                  platform, pricing, or how to get the most out of ashopiy for
                  your business.
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-700 mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:info.ashopiy@gmail.com"
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        info.ashopiy@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-700 mb-1">
                        Phone
                      </h3>
                      <p className="text-neutral-600">+91 8840404797</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-700 mb-1">
                        Location
                      </h3>
                      <p className="text-neutral-600">
                        Headquarters: India (Remote)
                      </p>
                    </div>
                  </div>

                  {/* Support Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-700 mb-1">
                        Support Hours
                      </h3>
                      <p className="text-neutral-600">
                        Monday - Friday: 9AM - 6PM IST
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Response time: Within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {/* <div className="pt-6 border-t border-neutral-100">
                  <h3 className="font-medium text-neutral-700 mb-3">
                    Follow Us
                  </h3>
                  <div className="flex items-center gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaPaperPlane className="text-primary-600 text-xl" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-primary-600 text-sm" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-primary-600 text-sm" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Message *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FaComment className="text-primary-600 text-sm" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      rows="5"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </div>
                  )}
                </button>

                <p className="text-xs text-neutral-500 text-center">
                  We'll get back to you within 24 hours. Your privacy is
                  important to us.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
