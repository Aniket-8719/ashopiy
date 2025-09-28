import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import {
  FaShoppingCart,
  FaHashtag,
  FaBalanceScale,
  FaList,
  FaShoppingBasket,
  FaFilePdf,
  FaFileExcel,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { MdDelete, MdModeEdit } from "react-icons/md";

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
  });
  const [editId, setEditId] = useState(null);

  // Load items from local storage on component mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];
    setItems(storedItems);
  }, []);

  // Save items to local storage whenever the list updates
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing item
      setItems(
        items.map((item) =>
          item.id === editId ? { ...item, ...formData } : item
        )
      );
      setEditId(null);
    } else {
      // Add new item
      setItems([...items, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: "", quantity: "", unit: "kg" });
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setFormData({
      name: itemToEdit.name,
      quantity: itemToEdit.quantity,
      unit: itemToEdit.unit,
    });
    setEditId(id);
  };

  const clearAll = () => {
    setItems([]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Set title font and size
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setFontSize(18); // Set font size to large
    doc.text("Shopping List", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    }); // Center-align the title

    // Set item font and add items to the PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12); // Regular font size for items
    items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`,
        10,
        30 + index * 10
      );
    });

    // Save the PDF
    doc.save("shopping-list.pdf");
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shopping List");

    // Define worksheet columns with alignment for headers
    worksheet.columns = [
      {
        header: "#",
        key: "index",
        width: 5,
        style: { alignment: { horizontal: "center" } },
      },
      {
        header: "Name",
        key: "name",
        width: 20,
        style: { alignment: { horizontal: "center" } },
      },
      {
        header: "Quantity",
        key: "quantity",
        width: 15,
        style: { alignment: { horizontal: "center" } },
      },
    ];

    // Add rows with data and apply center alignment to cells
    items.forEach((item, index) => {
      const row = worksheet.addRow({
        index: index + 1,
        name: item.name,
        quantity: `${item.quantity} - ${item.unit}`,
      });

      // Center-align the content of the row
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // Center-align the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { bold: true }; // Set font to bold
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "shopping-list.xlsx";
    link.click();
  };

  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
      
          {/* Add/Edit Item Form */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
              <RiFileList3Fill className="text-primary-600" />
              {editId ? "Edit Item" : "Add New Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                {/* Item Name */}
                <div className="lg:col-span-5">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Item Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaShoppingCart className="text-primary-600 text-sm" />
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHashtag className="text-primary-600 text-sm" />
                    </div>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      type="number"
                      placeholder="Quantity"
                      className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Unit */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Unit
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pr-8 flex items-center pointer-events-none">
                      <FaBalanceScale className="text-primary-600 text-sm" />
                    </div>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="pl-10 w-full py-3.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                      required
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="unit">unit</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md"
                  >
                    {editId ? (
                      <span className="flex items-center justify-center">
                        <MdModeEdit className="mr-1" />
                        Update
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaPlus className="mr-1" />
                        Add
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <FaList className="text-primary-600" />
                Shopping Items
                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                  {items.length} items
                </span>
              </h2>

              {items.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Export:</span>
                  <button
                    onClick={downloadPDF}
                    className="inline-flex items-center px-3 py-2 text-neutral-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors text-sm border border-neutral-200"
                  >
                    <FaFilePdf className="mr-1 text-error-600" />
                    PDF
                  </button>
                  <button
                    onClick={downloadExcel}
                    className="inline-flex items-center px-3 py-2 text-neutral-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors text-sm border border-neutral-200"
                  >
                    <FaFileExcel className="mr-1 text-success-600" />
                    Excel
                  </button>
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-neutral-400">
                  <FaShoppingBasket className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-medium text-neutral-500 mb-1">
                    No items in your shopping list
                  </p>
                  <p className="text-sm text-neutral-400">
                    Add your first item using the form above
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {items.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => editItem(item.id)}
                              className="text-primary-600 hover:text-primary-800 p-2 rounded-md hover:bg-primary-50 transition-colors"
                              title="Edit"
                            >
                              <MdModeEdit size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-error-600 hover:text-error-800 p-2 rounded-md hover:bg-error-50 transition-colors"
                              title="Delete"
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {items.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={clearAll}
                className="inline-flex items-center px-4 py-2.5 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 transition-colors text-sm"
              >
                <FaTrash className="mr-2" />
                Clear All Items
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShoppingList;
