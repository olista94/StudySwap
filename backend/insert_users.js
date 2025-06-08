const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGO_URI = "mongodb+srv://olista:admin123@cluster.qssxj.mongodb.net/studyswap";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  reputation: Number,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Conectado a MongoDB");

    const password = "123";
    const hash = await bcrypt.hash(password, 10);

    await User.deleteMany({ email: "admin@studyswap.com" });

    const admin = new User({
      name: "Admin Admínez",
      email: "admin@studyswap.com",
      passwordHash: hash,
      reputation: 100,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Usuario creado correctamente");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

run();
