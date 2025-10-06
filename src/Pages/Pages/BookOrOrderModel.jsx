import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

export const BookOrOrderModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load post details!");
      }
    };
    fetchPost();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${id}/book`,
        data
      );
      setSuccessMsg(res.data.message || "Booked successfully");
      reset();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!post) return <p className="text-center text-gray-700 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mt-10 p-6 relative mb-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg"
        >
          ✕
        </button>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Address:</strong> {post.location?.address}
        </p>
        {post.restaurantName && (
          <p className="text-gray-600 mb-1">
            <strong>Restaurant:</strong> {post.restaurantName}
          </p>
        )}
        <p className="text-gray-600 mb-1">
          <strong>Price:</strong>{" "}
          {post.isFree ? (
            <span className="text-green-600">Free</span>
          ) : (
            `৳ ${post.price}`
          )}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              {...register("userName", { required: true })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              {...register("contact", { required: true })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Address
            </label>
            <textarea
              {...register("address", { required: true })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Enter your address"
            ></textarea>
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};
