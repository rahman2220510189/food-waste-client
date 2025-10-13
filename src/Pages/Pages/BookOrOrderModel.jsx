import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

export const BookOrOrderModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [post, setPost] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
        
        // Calculate distance (example: random or from location)
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
    // Example: Random distance between 1-5 km
    // In real app, calculate from user's current location
    const dist = (Math.random() * 4 + 1).toFixed(1);
    setDistance(dist);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const endpoint = post.isFree 
        ? `/api/posts/${id}/book` 
        : `/api/posts/${id}/order`;
      
      const res = await axios.put(
        `http://localhost:5000${endpoint}`,
        data
      );

      // Show success message
      setSuccessMsg(res.data.message || "Successfully confirmed!");
      reset();
      
      // Wait 2 seconds before redirect
      setTimeout(() => {
        navigate("/browse", { 
          state: { 
            type: post.isFree ? "booking" : "order",
            postTitle: post.title,
            userData: data
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mt-10 p-6 relative mb-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition duration-200 z-10"
        >
          ✕
        </button>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
        />
        
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
            />
            {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
          </div>

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
            />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
          </div>

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
            ></textarea>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-pulse">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold animate-pulse">
              ✓ {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || successMsg}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition duration-200 flex items-center justify-center gap-2 ${
              loading || successMsg
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                {actionLabel}...
              </>
            ) : successMsg ? (
              <>
                <span>✓ Redirecting...</span>
              </>
            ) : (
              `${actionText}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};