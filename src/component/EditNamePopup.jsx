// SkipPersonalization.jsx
export default function EditNamePopup({ onClose, onConfirm }) {
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
        {/* Main Heading */}
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
        />



        {/* Horizontal button wrapper */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "100px",
            marginTop: "30px",
          }}
        >
          <button
            className="py-2 bg-black text-white rounded"
            style={{ fontSize: "15px", borderRadius: "10px", padding: "6px 20px" }}
            onClick={onConfirm}
          >
            Save
          </button>

          <button
            className="py-2 bg-gray-200 rounded"
            style={{ fontSize: "15px", borderRadius: "10px", padding: "6px 10px" }}
            onClick={onClose}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
