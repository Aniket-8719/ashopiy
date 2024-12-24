import React, { useEffect, useState } from "react";
import { clearError, contactUs } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { CONTACTUS_RESET } from "../../constants/userConstants";

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
      <section className="mt-12 md:mt-16 md:ml-72">
        <div className=" p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Get In Touch</h2>
                <p className="text-gray-700">
                  If you have any questions or need more information, feel free
                  to contact us using the form or the details provided below.
                </p>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>
                    <a
                      href="mailto:support@example.com"
                      className="text-blue-600 hover:underline"
                    >
                      info.ashopiy@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>+8840404797</p>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>Headquarters: India (Remote)</p>
                </div>

                {/* <div className="mt-8">
                  <h3 className="font-semibold mb-2">Our Location</h3>
                  <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                    // Placeholder for map
                    <span className="text-gray-600">Map goes here</span>
                  </div>
                </div> */}
              </div>

              {/* Contact Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  {loading ? <Loader /> : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
