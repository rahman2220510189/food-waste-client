import { useState } from "react";
import axios from "axios";

const UploadForm = ({ onUpload }) => {
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
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post("http://localhost:5000/api/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(" Food posted successfully!");
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
      alert(" Upload failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Food</h2>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Food Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} />
          Free Food
        </label>
      </div>

      {/* Paid Food Fields */}
      {!formData.isFree && (
        <>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Restaurant Address</label>
            <input
              type="text"
              name="restaurantAddress"
              value={formData.restaurantAddress}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Review / Description</label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              rows="3"
              required
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Price (৳)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </>
      )}

      {/* Free Food only needs price=0 */}
      {formData.isFree && (
        <p className="text-sm text-gray-500 mb-3">Price is automatically set to 0 for free food.</p>
      )}

      <div className="mb-3">
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <button
          type="button"
          onClick={handleLocation}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Use My Current Location
        </button>
        {formData.lat && formData.lng && (
          <p className="text-sm text-gray-500 mt-2">
            Location set: ({parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)})
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
      >
        Upload
      </button>
    </form>
  );
};

export default UploadForm;
