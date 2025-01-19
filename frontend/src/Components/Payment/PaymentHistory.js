import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import Loader from "../Layouts/Loader";

const PaymentHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (isoDate) => moment.utc(isoDate).format("DD/MM/YYYY");

  useEffect(() => {
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
        console.error(
          "Error fetching payment history:",
          error.response?.data?.message
        );
      } finally {
        setLoading(false);
      }
    };

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

    doc.text(`Name: ${user.shopOwnerName}`, 20, 40);
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
      <section className="mt-14 md:mt-18  md:ml-72">
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-gray-700 mb-6 ml-6">
              Payment History
            </h1>
            {loading ? (
              <div className="flex justify-center items-center mt-24">
                <Loader />
              </div>
            ) : payments.length === 0 ? (
              <p>No payment history available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Plan Name
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Amount
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Payment_Id
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment?._id}
                        className="border-t border-gray-200"
                      >
                        <td className="px-6 py-4 text-gray-700 capitalize">
                          {payment?.planName}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          ₹
                          {new Intl.NumberFormat("en-IN").format(
                            (payment?.amount ?? 0).toFixed(2)
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(payment?.createdAt)}
                        </td>
                        <td
                          className={`px-6 py-4 ${
                            payment?.status === "completed"
                              ? "text-green-500"
                              : payment?.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {payment?.status}
                        </td>
                        <td className="px-6 py-4 text-gray-700 capitalize">
                          {payment?.razorpayPaymentId}
                        </td>
                        {payment?.status === "completed" && (
                          <td className="px-6 py-4">
                            <button
                              onClick={() => downloadReceipt(payment)}
                              className="text-blue-500 rounded-sm hover:text-blue-600"
                            >
                              Download Receipt
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentHistory;
