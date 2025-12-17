require("dotenv").config();
const app = require("./app");
const { connectMongo, bindMongoLogs } = require("./db/mongoose");

// Render sẽ tự động cung cấp biến process.env.PORT, nếu không có thì dùng 4000 (Local)
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    bindMongoLogs();
    await connectMongo();
    
    // Thêm '0.0.0.0' để Render có thể kết nối ra bên ngoài
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`▶ Shoply API is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();