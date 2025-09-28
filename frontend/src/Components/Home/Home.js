import {
  FaCirclePlay,
  FaArrowRight,
  FaCheck,
  FaStar,
  FaChartLine,
  FaUsers,
} from "react-icons/fa6";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import FAQ from "./Faq";
import FeaturesSection from "./FeatureSection";

const Home = () => {
  return (
    <>
    <div className="lg:mt-12 lg:ml-72">
  {/* Main Hero Section */}
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 -z-10 transform skew-y-3 lg:skew-y-0 lg:rounded-b-[100px]"></div>

    <div className="flex flex-col gap-8 mt-16 lg:mt-0 lg:gap-0 lg:flex-row items-center justify-between px-4 lg:px-12 py-12 lg:py-16">
      {/* Text Section */}
      <div className="text-left w-full lg:max-w-[55%] px-2">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
          Revolutionizing Small Business Management
        </div>

        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-800 leading-tight lg:leading-snug">
          Simplify Your Shop Management with{" "}
          <span className="text-primary-600 relative">
            ashopiy
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,15 Q100,0 200,15"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-primary-300"
              />
            </svg>
          </span>
        </h1>

        <p className="text-neutral-600 text-lg lg:text-xl mt-6 max-w-2xl">
          Our all-in-one platform helps you track sales, manage finances,
          handle credit transactions, and grow your business with powerful
          analytics tools designed specifically for small shops.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to={"/pricing"}
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:from-primary-700 hover:to-secondary-700"
          >
            Get Started Free
            <FaArrowRight className="ml-2" />
          </Link>

          <Link
            to={"/video"}
            className="inline-flex items-center justify-center gap-2 bg-white text-neutral-800 font-medium text-lg px-6 py-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm"
          >
            <FaCirclePlay className="text-primary-600" />
            Watch Demo
          </Link>
        </div>

        <div className="mt-8 flex items-center text-neutral-500 text-sm">
          <div className="flex items-center mr-6">
            <FaCheck className="text-success mr-1" />
            No credit card required
          </div>
          <div className="flex items-center">
            <FaCheck className="text-success mr-1" />
            14-day free trial
          </div>
        </div>
      </div>

      {/* Custom SVG Illustration */}
      {/* Custom SVG Illustration */}
            <div className="w-full lg:w-[45%] mb-6 lg:mb-0 relative">
              <div className="relative z-10">
                <svg
                  viewBox="0 0 600 430"
                  className="w-full rounded-xl shadow-2xl border-8 border-white bg-white p-6"
                >
                  {/* Dashboard background */}
                  <rect
                    x="30"
                    y="20"
                    width="540"
                    height="390"
                    rx="12"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />

                  {/* Header */}
                  <rect
                    x="40"
                    y="30"
                    width="520"
                    height="50"
                    rx="8"
                    fill="#4f46e5"
                  />
                  <text
                    x="60"
                    y="60"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                    fontSize="16"
                    fontWeight="600"
                  >
                    Shop Management Dashboard
                  </text>

                  {/* Sidebar */}
                  <rect
                    x="40"
                    y="90"
                    width="140"
                    height="300"
                    rx="8"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />

                  {/* Sidebar menu items with proper spacing */}
                  {[
                    { y: 115, filled: true, text: "Dashboard" },
                    { y: 145, filled: false, text: "Sales" },
                    { y: 175, filled: false, text: "Customers" },
                    { y: 205, filled: false, text: "Udhar" },
                    { y: 235, filled: false, text: "Inventory" },
                    { y: 265, filled: false, text: "Reports" },
                    { y: 295, filled: false, text: "Settings" },
                  ].map((item, index) => (
                    <g key={index}>
                      <circle
                        cx="60"
                        cy={item.y}
                        r="6"
                        fill={item.filled ? "#4f46e5" : "#cbd5e1"}
                      />
                      <rect
                        x="75"
                        y={item.y - 6}
                        width="90"
                        height="12"
                        rx="3"
                        fill="#cbd5e1"
                      />
                    </g>
                  ))}

                  {/* Main Content Area */}
                  <rect
                    x="190"
                    y="90"
                    width="360"
                    height="300"
                    rx="8"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />

                  {/* Stats Grid - 2x2 layout with proper spacing */}
                  <g>
                    {/* Today's Sales */}
                    <rect
                      x="210"
                      y="110"
                      width="160"
                      height="80"
                      rx="6"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <circle
                      cx="225"
                      cy="130"
                      r="10"
                      fill="#4f46e5"
                      opacity="0.2"
                    />
                    <circle cx="225" cy="130" r="5" fill="#4f46e5" />
                    <text
                      x="245"
                      y="132"
                      fill="#1e293b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                    >
                      Today's Sales
                    </text>
                    <text
                      x="245"
                      y="152"
                      fill="#4f46e5"
                      fontFamily="system-ui, sans-serif"
                      fontSize="16"
                      fontWeight="700"
                    >
                      ₹12,458
                    </text>
                    <text
                      x="245"
                      y="172"
                      fill="#64748b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="12"
                    >
                      +12% from yesterday
                    </text>

                    {/* Customers */}
                    <rect
                      x="380"
                      y="110"
                      width="160"
                      height="80"
                      rx="6"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <circle
                      cx="395"
                      cy="130"
                      r="10"
                      fill="#10b981"
                      opacity="0.2"
                    />
                    <circle cx="395" cy="130" r="5" fill="#10b981" />
                    <text
                      x="415"
                      y="132"
                      fill="#1e293b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                    >
                      Customers
                    </text>
                    <text
                      x="415"
                      y="152"
                      fill="#10b981"
                      fontFamily="system-ui, sans-serif"
                      fontSize="16"
                      fontWeight="700"
                    >
                      42
                    </text>
                    <text
                      x="415"
                      y="172"
                      fill="#64748b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="12"
                    >
                      +5 from yesterday
                    </text>

                    {/* Udhar Balance */}
                    <rect
                      x="210"
                      y="200"
                      width="160"
                      height="80"
                      rx="6"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <circle
                      cx="225"
                      cy="220"
                      r="10"
                      fill="#f59e0b"
                      opacity="0.2"
                    />
                    <circle cx="225" cy="220" r="5" fill="#f59e0b" />
                    <text
                      x="245"
                      y="222"
                      fill="#1e293b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                    >
                      Udhar Balance
                    </text>
                    <text
                      x="245"
                      y="242"
                      fill="#f59e0b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="16"
                      fontWeight="700"
                    >
                      ₹7,650
                    </text>
                    <text
                      x="245"
                      y="262"
                      fill="#64748b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="12"
                    >
                      -₹350 from yesterday
                    </text>

                    {/* Expenses */}
                    <rect
                      x="380"
                      y="200"
                      width="160"
                      height="80"
                      rx="6"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <circle
                      cx="395"
                      cy="220"
                      r="10"
                      fill="#ef4444"
                      opacity="0.2"
                    />
                    <circle cx="395" cy="220" r="5" fill="#ef4444" />
                    <text
                      x="415"
                      y="222"
                      fill="#1e293b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                    >
                      Expenses
                    </text>
                    <text
                      x="415"
                      y="242"
                      fill="#ef4444"
                      fontFamily="system-ui, sans-serif"
                      fontSize="16"
                      fontWeight="700"
                    >
                      ₹3,250
                    </text>
                    <text
                      x="415"
                      y="262"
                      fill="#64748b"
                      fontFamily="system-ui, sans-serif"
                      fontSize="12"
                    >
                      -8% from yesterday
                    </text>
                  </g>

                  {/* Chart Section */}
                  <rect
                    x="210"
                    y="290"
                    width="330"
                    height="80"
                    rx="6"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text
                    x="220"
                    y="315"
                    fill="#1e293b"
                    fontFamily="system-ui, sans-serif"
                    fontSize="14"
                    fontWeight="600"
                  >
                    Sales Performance
                  </text>

                  {/* Mini chart preview - Moved downward by 25 units total */}
                  <polyline
                    points="320,340 340,330 360,335 380,325 400,320 420,315 440,310"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />
                  <circle cx="320" cy="340" r="2" fill="#4f46e5" />
                  <circle cx="340" cy="330" r="2" fill="#4f46e5" />
                  <circle cx="360" cy="335" r="2" fill="#4f46e5" />
                  <circle cx="380" cy="325" r="2" fill="#4f46e5" />
                  <circle cx="400" cy="320" r="2" fill="#4f46e5" />
                  <circle cx="420" cy="315" r="2" fill="#4f46e5" />
                  <circle cx="440" cy="310" r="2" fill="#4f46e5" />

                  {/* View Report button */}
                  <rect
                    x="464"
                    y="325"
                    width="68"
                    height="20"
                    rx="4"
                    fill="#4f46e5"
                  />
                  <text
                    x="470"
                    y="339"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                    fontSize="10"
                    fontWeight="500"
                  > 
                    View Report
                  </text>
                  {/* Bottom navigation */}
                  <rect
                    x="40"
                    y="380"
                    width="520"
                    height="20"
                    rx="4"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />

                  {/* Navigation icons */}
                  <g>
                    <rect
                      x="60"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#4f46e5"
                    />
                    <rect
                      x="100"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="140"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="180"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="220"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="260"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="300"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="340"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="380"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="420"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="460"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                    <rect
                      x="500"
                      y="384"
                      width="12"
                      height="12"
                      rx="3"
                      fill="#cbd5e1"
                    />
                  </g>
                </svg>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-lg z-20 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaChartLine className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-semibold">+25% Revenue</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg z-20 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-semibold">+42 Customers</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                </div>
              </div>
            </div>
    </div>
  </section>

  {/* Stats Section */}
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            500+
          </div>
          <div className="text-neutral-600">Active Shops</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            92%
          </div>
          <div className="text-neutral-600">Customer Satisfaction</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            ₹10M+
          </div>
          <div className="text-neutral-600">Transactions Processed</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            24/7
          </div>
          <div className="text-neutral-600">Support Available</div>
        </div>
      </div>
    </div>
  </section>

  {/* Testimonials Section */}
  <section className="py-16 bg-neutral-50">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4">
          Loved by Shop Owners
        </h2>
        <p className="text-neutral-600">
          See what our customers are saying about ashopiy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-warning-500" />
            ))}
          </div>
          <p className="text-neutral-600 mb-6">
            "Since using ashopiy, I've saved 10+ hours weekly on
            accounting and can focus more on growing my business."
          </p>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
              RS
            </div>
            <div>
              <div className="font-semibold">Rajesh Sharma</div>
              <div className="text-sm text-neutral-500">
                Grocery Store Owner
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-warning-500" />
            ))}
          </div>
          <p className="text-neutral-600 mb-6">
            "The udhar management system has completely transformed how I
            handle credit with my customers. No more forgotten payments!"
          </p>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
              PK
            </div>
            <div>
              <div className="font-semibold">Priya Kapoor</div>
              <div className="text-sm text-neutral-500">
                Clothing Boutique
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-warning-500" />
            ))}
          </div>
          <p className="text-neutral-600 mb-6">
            "The analytics dashboard helped me identify my most profitable
            products and optimize my inventory. Sales are up 30%!"
          </p>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
              AK
            </div>
            <div>
              <div className="font-semibold">Amit Kumar</div>
              <div className="text-sm text-neutral-500">
                Electronics Store
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Features Section */}
  <FeaturesSection />

  {/* CTA Section */}
  <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6">
        Ready to Transform Your Shop Management?
      </h2>
      <p className="text-primary-100 max-w-2xl mx-auto mb-8 text-lg">
        Join thousands of shop owners who are already simplifying their
        business operations with ashopiy
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={"/pricing"}
          className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-neutral-100 transition-all"
        >
          Get Started Free
        </Link>
        <Link
          to={"/contact"}
          className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white font-semibold text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all"
        >
          Contact Sales
        </Link>
      </div>
    </div>
  </section>

  <FAQ />
  <Footer />
</div>
    </>
  );
};

export default Home;
