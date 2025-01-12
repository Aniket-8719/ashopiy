import React from "react";
import Loader from "../Layouts/Loader";
import { Link } from "react-router-dom";
import OneLineSingleUserSubscription from "./OneLineSingleUserSubscription";

const UserTable = ({ users, loading }) => {
  const columns = [
    { key: "email", label: "Email" },
    { key: "mobileNo", label: "Mobile No." },
    { key: "shopName", label: "Shop Name" },
    { key: "shopType", label: "Shop Type" },
    { key: "shopOwnerName", label: "Owner Name" },
    { key: "city", label: "City" },
    { key: "subscriptionDays", label: "Subscription Days" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <section>
      {/* Table */}
      <div className="bg-white mt-4 overflow-x-auto relative max-h-[700px] md:max-h-[620px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900 text-white sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 text-center relative">
            {/* Conditionally render the loader inside tbody */}
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="relative h-32">
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {users?.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.mobileNo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.shopName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.shopType || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.shopOwnerName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.city || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {<OneLineSingleUserSubscription user={user} /> || "N/A"}
                      </td>
                      <td className="font-bold px-6 py-4 whitespace-nowrap">
                        {user.subscription.basic.isActive ||
                        user.subscription.premium.isActive ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                        <Link
                          to={`/admin/user/${user?._id}`}
                          className="rounded-md text-blue-600 underline underline-offset-2 flex items-center justify-center"
                        >
                          view Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-4 text-center"
                    >
                      No user data available
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserTable;
