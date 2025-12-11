// SkipPersonalization.jsx
export default function SkipPersonalization({ onClose, onConfirm }) {
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
          Are you sure you want to skip personalization?
        </p>

        {/* New explanatory text */}
        <p className="text-gray-600 text-[12px] mb-5 leading-[1.4]">
          Any changes you’ve made so far will be discarded, but you can always
          edit them later in your profile page.
        </p>

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
            style={{ fontSize: "15px", borderRadius: "10px", padding: "6px 20px"}}
            onClick={onConfirm}
          >
            Skip
          </button>

          <button
            className="py-2 bg-gray-200 rounded"
            style={{ fontSize: "15px", borderRadius: "10px",  padding: "6px 10px"}}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
