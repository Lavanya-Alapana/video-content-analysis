import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});

    const users = [
      {
        email: "admin@test.com",
        password: "admin123",
        role: "admin",
        orgId: "org1",
      },
      {
        email: "editor@test.com",
        password: "editor123",
        role: "editor",
        orgId: "org1",
      },
      {
        email: "viewer@test.com",
        password: "viewer123",
        role: "viewer",
        orgId: "org1",
      },
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log("✅ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
