import React from "react";
import Loader from "../Layouts/Loader";
import { Link } from "react-router-dom";
import OneLineSingleUserSubscription from "./OneLineSingleUserSubscription";
import { FaUsers } from "react-icons/fa6";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

const UserTable = ({ users, loading }) => {
  const columns = [
    { key: "email", label: "Email" },
    { key: "mobileNo", label: "Mobile No." },
    { key: "shopName", label: "Shop Name" },
    { key: "shopType", label: "Shop Type" },
    { key: "Name", label: "Owner Name" },
    { key: "city", label: "City" },
    { key: "subscriptionDays", label: "Subscription Days" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="overflow-x-auto pb-8">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-neutral-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <div className="flex justify-center items-center">
                  <Loader />
                </div>
              </td>
            </tr>
          ) : (
            <>
              {users?.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.mobileNo || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.shopName || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.shopType || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.Name || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {user.city || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {<OneLineSingleUserSubscription user={user} /> || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {user.subscription.basic.isActive ||
                      user.subscription.premium.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/user/${user?._id}`}
                        className="text-primary-600 hover:text-primary-900 font-medium inline-flex items-center"
                      >
                        View Details
                        <LiaExternalLinkAltSolid className="ml-1 text-xs" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <FaUsers className="w-10 h-10 mb-2 opacity-50" />
                      <p className="font-medium text-sm">
                        No user records found
                      </p>
                      <p className="text-xs mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
