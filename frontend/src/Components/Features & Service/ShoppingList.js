import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";

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
    doc.text("Shopping List", 10, 10);
    items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`,
        10,
        20 + index * 10
      );
    });
    doc.save("shopping-list.pdf");
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shopping List");

    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Name", key: "name", width: 20 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Unit", key: "unit", width: 10 },
    ];

    items.forEach((item, index) => {
      worksheet.addRow({
        index: index + 1,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "shopping-list.xlsx";
    link.click();
  };

  return (
    <>
      <section className="mt-14 md:mt-20  md:ml-72">
        <div className="p-2 md:p-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Shopping List</h1>

          {/* Add/Edit Item Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mb-8 items-end bg-gray-100 p-2 rounded shadow-md "
          >
            {/* <div className="flex flex-col justify-center w-full"> */}
            <div className="flex flex-col md:flex-row w-full md:gap-4">
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm">Item Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row w-full mt-4">
                <div className="flex w-full gap-2">
                  <div className="flex flex-col w-full ">
                    <label className="mb-1 text-sm">Quantity</label>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      type="number"
                      placeholder="Enter quantity"
                      className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-sm">Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
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
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-3 mt-4 md:mt-6 w-full md:ml-2 rounded hover:bg-blue-600 "
                >
                  {editId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>

            {/* </div> */}
          </form>

          {/* Items Table */}
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">#</th>
                <th className="border border-gray-200 p-2">Name</th>
                <th className="border border-gray-200 p-2">Quantity</th>
                <th className="border border-gray-200 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-200 p-2">{index + 1}</td>
                  <td className="border border-gray-200 p-2">{item.name}</td>
                  <td className="border border-gray-200 p-2">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="border border-gray-200 p-2">
                    <button
                      onClick={() => editItem(item.id)}
                      className="text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Download and Clear Buttons */}
          <div className="mt-6 flex flex-wrap gap-4 justify-between">
            <div className="flex gap-4">
              <button
                onClick={downloadPDF}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download PDF
              </button>
              <button
                onClick={downloadExcel}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Download Excel
              </button>
            </div>
            <button
              onClick={clearAll}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShoppingList;
