import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { User } from "../src/models/User";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    const users = [
      {
        username: "admin",
        password: "password123",
        role: "admin",
      },
      {
        username: "accountant1",
        password: "password123",
        role: "accountant",
      },
      {
        username: "accountant2",
        password: "password123",
        role: "accountant",
      },
    ];

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await User.create({ username: user.username, passwordHash, role: user.role });
    }

    console.log("Users seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding users:", error);
    mongoose.disconnect();
  }
};

seedUsers();
