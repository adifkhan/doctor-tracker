import { connectDB, disconnectDB } from "../config/db.js";
import * as userRepository from "../repositories/user.repository.js";

const seed = async () => {
  await connectDB();

  const ADMIN_NAME = "Admin";
  const ADMIN_EMAIL = "admin@doctortracker.com";
  const ADMIN_PASSWORD = "Admin@12345";

  if (await userRepository.existsByEmail(ADMIN_EMAIL)) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  } else {
    await userRepository.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }
};

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
