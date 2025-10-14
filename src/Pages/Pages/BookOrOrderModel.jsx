import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { LiveMap } from "../../Other/LiveMap";


export const BookOrOrderModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [post, setPost] = useState(null);
  const [distance, setDistance] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);

        if (res.data.location?.coordinates) {
          calculateDistance(res.data.location.coordinates);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load post details!");
      }
    };
    fetchPost();
  }, [id]);

  const calculateDistance = (coordinates) => {
    const dist = (Math.random() * 4 + 1).toFixed(1);
    setDistance(dist);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= post.quantity) {
      setQuantity(value);
    }
  };

  const handleQuantityIncrement = () => {
    if (quantity < post.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    if (post.isFree) return 0;
    return (post.price * quantity).toFixed(2);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const submitData = {
        ...data,
        quantity,
        paymentMethod,
        totalPrice: calculateTotalPrice()
      };

      if (!post.isFree && paymentMethod === "online") {
        setErrorMsg("Payment gateway integration coming soon!");
        setLoading(false);
        return;
      }

      const endpoint = post.isFree 
        ? `/api/posts/${id}/book` 
        : `/api/posts/${id}/order`;
      
      const res = await axios.put(
        `http://localhost:5000${endpoint}`,
        submitData
      );

      setSuccessMsg(res.data.message || "Successfully confirmed!");
      reset();
      setQuantity(1);
      
      setTimeout(() => {
        navigate("/browse", { 
          state: { 
            type: post.isFree ? "booking" : "order",
            postTitle: post.title,
            userData: submitData,
            paymentMethod
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(err.response?.data?.error || "Operation failed!");
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const actionText = post.isFree ? "Book Now" : "Order Now";
  const actionLabel = post.isFree ? "Booking" : "Ordering";
  const isOutOfStock = post.quantity <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-200 font-semibold flex items-center gap-2 transition"
          >
            ← Back
          </button>
        </div>

        {/* MAP - TOP SECTION */}
        <div className="mb-0">
          <LiveMap />
        </div>

        {/* FORM - BOTTOM SECTION */}
        <div className="bg-white rounded-b-2xl shadow-2xl px-6 pb-6 pt-4">
          
          {/* Product Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-72 object-cover rounded-xl mb-4 shadow-md"
          />
          
          {/* Product Title and Badge */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              post.isFree 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {post.isFree ? '✓ FREE' : '💳 PAID'}
            </span>
          </div>

          {/* Product Info */}
          <div className="space-y-2 mb-4 text-sm">
            <p className="text-gray-600">
              <strong className="text-gray-700">📍 Location:</strong> {post.location?.address}
            </p>
            {distance && (
              <p className="text-gray-600">
                <strong className="text-gray-700">📏 Distance:</strong> <span className="text-blue-600 font-semibold">{distance} km</span>
              </p>
            )}
            {post.restaurantName && (
              <p className="text-gray-600">
                <strong className="text-gray-700">🏪 Restaurant:</strong> {post.restaurantName}
              </p>
            )}
            <p className="text-gray-600">
              <strong className="text-gray-700">💰 Price:</strong>{" "}
              {post.isFree ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                <span className="text-blue-600 font-semibold">৳ {post.price}</span>
              )}
            </p>
            <p className={`text-gray-600 ${isOutOfStock ? 'text-red-600' : ''}`}>
              <strong className="text-gray-700">📦 Available Items:</strong>{" "}
              <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? "Out of Stock" : `${post.quantity} available`}
              </span>
            </p>
          </div>

          {/* Total Price */}
          {!isOutOfStock && !post.isFree && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💳 Total Price</p>
              <p className="text-lg font-bold text-blue-700">৳ {calculateTotalPrice()}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register("userName", { 
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isOutOfStock}
              />
              {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                {...register("contact", { 
                  required: "Contact number is required",
                  pattern: { value: /^[0-9]{10,11}$/, message: "Please enter a valid phone number (10-11 digits)" }
                })}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
                disabled={isOutOfStock}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                {...register("address", { 
                  required: "Address is required",
                  minLength: { value: 10, message: "Please enter a complete address" }
                })}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Enter your complete delivery address"
                disabled={isOutOfStock}
              ></textarea>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Quantity */}
            {!post.isFree && !isOutOfStock && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📦 Quantity
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    type="button"
                    onClick={handleQuantityDecrement}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-lg transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={post.quantity}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleQuantityIncrement}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-lg transition"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-2">Max: {post.quantity}</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {!post.isFree && !isOutOfStock && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💳 Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Online Payment</span>
                  </label>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-pulse">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold animate-pulse">
                ✓ {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || successMsg || isOutOfStock}
              className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition duration-200 flex items-center justify-center gap-2 ${
                loading || successMsg || isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg active:scale-95"
              }`}
            >
              {isOutOfStock ? (
                "❌ Out of Stock"
              ) : loading ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  {actionLabel}...
                </>
              ) : successMsg ? (
                "✓ Redirecting..."
              ) : (
                actionText
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};