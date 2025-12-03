import { useContext, useState } from "react";
import axios from "axios";
import { FiUploadCloud, FiMapPin, FiTag, FiShoppingBag, FiStar, FiFileText } from "react-icons/fi";
import { AuthContext } from "../firebase/Provider/AuthProviders"; // Import AuthContext

const UploadForm = ({ onUpload }) => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    isFree: false,
    address: "",
    lat: "",
    lng: "",
    image: null,
    restaurantName: "",
    restaurantAddress: "",
    quantity: "",
    review: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("📍 Location detected!");
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.uid) {
      alert("⚠️ Please login first to upload food!");
      return;
    }
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      // Add ownerId to FormData
      data.append("ownerId", user.uid);

      const res = await axios.post("http://localhost:5000/api/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Food posted successfully!");
      onUpload && onUpload(res.data);

      // reset
      setFormData({
        title: "",
        price: "",
        isFree: false,
        address: "",
        lat: "",
        lng: "",
        image: null,
        restaurantName: "",
        restaurantAddress: "",
        quantity: "",
        review: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed!");
    }
  };

  return (
    // Outer container for the premium background and centering
    <div className="min-h-screen py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      {/* Form container with modern styling */}
      <div className="w-full max-w-2xl p-8 md:p-12 bg-gray-900 border border-gray-700 rounded-3xl shadow-[0_20px_50px_rgba(20,20,20,0.8)]">
        
        {/* Form itself - minimal class added for consistency */}
        <form onSubmit={handleSubmit} className="p-0">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <FiUploadCloud className="mx-auto h-12 w-12 text-green-400 mb-2" />
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Share Your Food 🍽️
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              List new food items for others to find and enjoy.
            </p>
          </div>

          {/* Input Fields Wrapper (Grid/Columns for large screen) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Food Title */}
            <div className="mb-3">
              <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                <FiFileText className="h-4 w-4 text-green-400" /> Food Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                // Existing and new styling: dark input, focus ring
                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="Delicious meal or ingredient"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                <FiTag className="h-4 w-4 text-green-400" /> Image
              </label>
              {/* Custom styled file input wrapper */}
              <div className="p-3 border-2 border-dashed border-gray-600 rounded-xl hover:border-green-500 transition duration-200">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer transition duration-200"
                />
              </div>
            </div>

            {/* isFree Checkbox (Full width for better flow) */}
            <div className="mb-3 md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:border-green-500 transition duration-200">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  // Custom checkbox styling using accent color
                  className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-600 bg-gray-700 focus:ring-green-500"
                />
                <span className="text-xl font-bold text-green-400">🎁 Free Food?</span>
                <span className="text-gray-400 text-sm ml-auto">Check if this item is being given away for free.</span>
              </label>
            </div>
            
            {/* Paid Food Fields - Conditional rendering kept */}
            {!formData.isFree && (
              <>
                {/* Restaurant Name */}
                <div className="mb-3">
                  <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-green-400" /> Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="E.g., Local Cafe, Sushi Spot"
                  />
                </div>

                {/* Restaurant Address */}
                <div className="mb-3">
                  <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                    <FiMapPin className="h-4 w-4 text-green-400" /> Restaurant Address
                  </label>
                  <input
                    type="text"
                    name="restaurantAddress"
                    value={formData.restaurantAddress}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Street address of the restaurant"
                  />
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2h-3s-1.343 0-3-2c0-1.105 1.343-2 3-2h3zm-3 8c1.657 0 3 .895 3 2s-1.343 2-3 2h-3c-1.657 0-3-.895-3-2s1.343-2 3-2h3z"></path></svg> Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Number of servings/units"
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Price (৳)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter price in Taka"
                  />
                </div>

                {/* Review / Description (Full width) */}
                <div className="mb-3 md:col-span-2">
                  <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                    <FiStar className="h-4 w-4 text-green-400" /> Review / Description
                  </label>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    rows="4" // Slightly taller textarea
                    required
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 resize-none"
                    placeholder="Describe the food, ingredients, and any special instructions."
                  ></textarea>
                </div>
              </>
            )}

            {/* Free Food Message - Conditional rendering kept */}
            {formData.isFree && (
              <p className="text-sm italic text-green-400 mb-3 md:col-span-2 p-3 bg-gray-800 rounded-lg border border-green-700">
                Price is automatically set to 0. Please specify quantity and location below.
              </p>
            )}

            {/* Address */}
            <div className="mb-3 md:col-span-2">
              <label className="block mb-2 font-semibold text-gray-200 flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-green-400" /> Address for Pickup
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="Specific pickup address"
              />
            </div>
          </div>
          
          {/* Location and GPS Buttons */}
          <div className="mb-6 border-t border-gray-700 pt-6 mt-4">
            <button
              type="button"
              onClick={handleLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/30 transition duration-300 w-full md:w-auto flex items-center justify-center gap-2"
            >
              <FiMapPin className="h-5 w-5" /> Use My Current Location
            </button>
            {formData.lat && formData.lng && (
              <p className="text-sm text-gray-400 mt-3 p-2 bg-gray-800 rounded-lg">
                <span className="text-green-400 font-medium">Location set:</span> Latitude: {parseFloat(formData.lat).toFixed(4)}, Longitude: {parseFloat(formData.lng).toFixed(4)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl w-full text-xl font-bold shadow-2xl shadow-green-600/50 transition duration-300 transform hover:scale-[1.01]"
          >
            <FiUploadCloud className="inline-block mr-2 h-6 w-6" /> POST FOOD NOW
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;