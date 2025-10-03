
export const BookOrOrderModel = ({ post, onClose, refresh }) => {
const handleConfirm = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${post._id}/book`);
      alert(res.data.message);
      refresh();
      onClose();
    } catch (err) {
      alert("Already booked or error!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded" />
        <p className="text-sm text-gray-600 mt-2">{post.location.address}</p>
        <p className="text-sm text-gray-600">{post.isFree ? "Free" : `৳ ${post.price}`}</p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Confirm {post.isFree ? "Booking" : "Order"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};
