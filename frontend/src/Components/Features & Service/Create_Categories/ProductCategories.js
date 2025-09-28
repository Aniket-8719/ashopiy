import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../../actions/productActions";
import {
  ADD_PRODUCT_RESET,
  DELETE_PRODUCT_RESET,
  UPDATE_PRODUCT_RESET,
} from "../../../constants/productConstants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MetaData from "../../Layouts/MetaData";
import Loader from "../../Layouts/Loader";
import { FaIndianRupeeSign, FaTags } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const ProductCategories = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const { categories, loading } = useSelector((state) => state.allProducts);
  const {
    isAdded,
    error: addError,
    loading: addLoading,
  } = useSelector((state) => state.addProduct);
  const { isUpdated, error: updateError } = useSelector(
    (state) => state.updateProduct
  );
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.deleteProduct
  );

  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
    if (isAdded) {
      toast.success("Category added successfully!");
      dispatch({ type: ADD_PRODUCT_RESET });
      dispatch(getAllProducts());
    }

    if (isUpdated) {
      toast.success("Category updated successfully!");
      dispatch({ type: UPDATE_PRODUCT_RESET });
      dispatch(getAllProducts());
    }

    if (isDeleted) {
      toast.success("Category deleted successfully!");
      dispatch({ type: DELETE_PRODUCT_RESET });
      dispatch(getAllProducts());
    }

    if (addError || updateError || deleteError) {
      toast.error(addError || updateError || deleteError);
    }

    // Reset form after success
    if (isAdded || isUpdated) {
      setFormData({ name: "", price: "" });
      setEditId(null);
    }
  }, [
    isAdded,
    isUpdated,
    isDeleted,
    addError,
    updateError,
    deleteError,
    dispatch,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
    };
    if (formData.price !== "" && !isNaN(Number(formData.price))) {
      payload.price = Number(formData.price);
    }
    if (editId) {
      dispatch(updateProduct(editId, payload));
    } else {
      dispatch(addProduct(payload));
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, price: category.price });
    setEditId(category._id);

    // Scroll form into view after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -300); // optional offset
    }, 100); // slight delay to ensure DOM is ready
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <MetaData title={"CATEGORIES"} />
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add/Edit Category Form */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-6 text-center">
                {editId ? "Update Category" : "Add New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="categoryName"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    placeholder="Enter category name"
                    value={formData.name}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="categoryPrice"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Price
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                    <FaIndianRupeeSign className="text-neutral-400" />
                  </div>
                  <input
                    type="number"
                    id="categoryPrice"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="pl-10 w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                    editId
                      ? "bg-warning-600 hover:bg-warning-700"
                      : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  } shadow-md hover:shadow-lg`}
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : editId ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </button>
              </form>
              <p className="text-sm text-neutral-600 mt-4">
                Once you’ve added a product price, you can view the details on
                the{" "}
                <Link
                  to="/earning"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Earnings
                </Link>{" "}
                page.
              </p>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-neutral-800">
                  All Categories
                </h3>
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {categories?.length || 0}
                </span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center py-3 animate-pulse"
                    >
                      <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                      <div className="flex space-x-2">
                        <div className="w-7 h-7 bg-neutral-200 rounded-full"></div>
                        <div className="w-7 h-7 bg-neutral-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <FaTags className="w-10 h-10 mb-3 opacity-50" />
                    <p className="font-medium">No categories found</p>
                    <p className="text-sm mt-1">
                      Add your first category using the form
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories?.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div>
                        <span className="text-neutral-800 font-medium block">
                          {cat.name}
                        </span>
                        {cat.price !== undefined && (
                          <span className="text-sm text-neutral-600">
                            ₹{new Intl.NumberFormat("en-IN").format(cat.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                          title="Edit category"
                        >
                          <MdModeEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="w-8 h-8 flex items-center justify-center bg-error-100 text-error-600 rounded-lg hover:bg-error-200 transition-colors"
                          title="Delete category"
                        >
                          <MdDelete className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCategories;
