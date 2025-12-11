import { useState } from "react";

export default function EditNamePopup({ currentName, onClose, onSave }) {
  const [name, setName] = useState(currentName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await onSave(name.trim());
      onClose();
    } catch (error) {
      console.error("Error saving name - Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      // More detailed error message
      let errorMessage = "Failed to save name. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = "No response from server. Check your connection.";
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          width: "420px",
          textAlign: "center",
        }}
      >
        <p className="text-gray-800 font-medium mb-3 text-[15px]">
          What should we call you?
        </p>

        <textarea
          className="w-full text-gray-900 text-[15px] border border-gray-300 rounded-lg mt-5 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-black overflow-hidden"
          rows={1}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ height: "45px" }}
          disabled={loading}
        />

        {error && (
          <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "100px",
            marginTop: "30px",
          }}
        >
          <button
            className="py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            style={{ fontSize: "15px", borderRadius: "10px", padding: "6px 20px" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            className="py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            style={{ fontSize: "15px", borderRadius: "10px", padding: "6px 10px" }}
            onClick={onClose}
            disabled={loading}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}