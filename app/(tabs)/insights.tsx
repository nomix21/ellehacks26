export default function InsightScreen() {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fbc2eb 100%)",
        borderRadius: "32px",
        margin: "16px",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#fff", fontSize: "20px", marginBottom: "24px" }}>
          You accomplished 5 goals this week.
        </p>
        <p style={{ color: "#fff", fontSize: "20px", marginBottom: "24px" }}>
          Your confidence has doubled.
        </p>
        <p style={{ color: "#fff", fontSize: "20px", marginBottom: "24px" }}>
          Overall, you were happy.
        </p>
      </div>
    </div>
  );
}
