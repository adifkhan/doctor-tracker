import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () =>
    console.log(`API listening on port ${env.PORT}`),
  );

  const shutdown = () =>
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
