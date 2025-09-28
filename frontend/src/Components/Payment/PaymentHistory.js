import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { FaDownload, FaReceipt } from "react-icons/fa6";

const PaymentHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (isoDate) => moment.utc(isoDate).format("DD/MM/YYYY");
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v2/payment-history`,
        {
          withCredentials: true, // Include cookies with the request
        }
      );
      setPayments(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch payment history.";
      toast.error(errorMessage);
      console.error("Error fetching payment history:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Generate PDF Receipt
  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Receipt", 105, 20, null, null, "center");

    // Shopkeeper Info Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${user.Name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Mobile/WhatsApp: ${user.mobileNo || user.whatsappNo}`, 20, 60);

    // Add another line separator after user info
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65); // Horizontal line

    // Add a Table for Payment Details
    doc.autoTable({
      startY: 75, // Start the table after the separator line
      head: [["Field", "Value"]],
      body: [
        ["Plan Name", payment.planName],
        [
          "Amount",
          `${new Intl.NumberFormat("en-IN").format(payment.amount.toFixed(2))}`,
        ],
        ["Date", formatDate(payment.createdAt)],
        ["Status", payment.status],
        ["Payment ID", payment.razorpayPaymentId || "N/A"],
      ],
      theme: "striped", // Makes the table have alternating row colors
      styles: {
        fontSize: 12,
        cellPadding: 3,
        minCellHeight: 10,
        halign: "left", // Align all cells to the left
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue color for header row
        textColor: 255, // White text color
      },
      alternateRowStyles: {
        fillColor: [235, 236, 240], // Light gray for alternating rows
      },
      margin: { top: 20 },
    });

    // Footer message
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const footerText = "Thank you for your payment!";
    doc.text(
      footerText,
      105,
      doc.lastAutoTable.finalY + 10,
      null,
      null,
      "center"
    );

    // Save the PDF with a custom name
    doc.save(`Receipt_${payment.razorpayPaymentId || "N/A"}.pdf`);
  };

  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              Payment History
            </h1>
            <p className="text-neutral-600 mt-1 text-sm lg:text-base">
              View your subscription payments and receipts
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
              <div className="flex flex-col items-center justify-center text-neutral-400">
                <FaReceipt className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">No payment history found</p>
                <p className="text-sm mt-1">
                  Your payment records will appear here
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Plan Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {payments.map((payment) => (
                      <tr
                        key={payment?._id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 capitalize">
                          {payment?.planName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          ₹
                          {new Intl.NumberFormat("en-IN").format(
                            (payment?.amount ?? 0).toFixed(2)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {formatDate(payment?.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment?.status === "completed"
                                ? "bg-success-100 text-success-800"
                                : payment?.status === "pending"
                                ? "bg-warning-100 text-warning-800"
                                : "bg-error-100 text-error-800"
                            }`}
                          >
                            {payment?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 font-mono">
                          {payment?.razorpayPaymentId?.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment?.status === "completed" && (
                            <button
                              onClick={() => downloadReceipt(payment)}
                              className="text-primary-600 hover:text-primary-900 flex items-center"
                            >
                              <FaDownload className="mr-1 text-sm" />
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PaymentHistory;
