// Modules
import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { createClient } from "redis";
import { fetchOrders } from "./handlers/fetchOrders.mjs";
import { user } from "./handlers/user.mjs";
import { userList } from "./handlers/userList.mjs";

// Redis setup
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error:", err));
await redisClient.connect();

// Express setup
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());

// Routes
app.get("/api/user/:username", (req, res) => {
  user(req, res, redisClient);
});
app.get("/api/userList", (req, res) => {
  userList(req, res, redisClient);
});

// Fetch and cache data on initialization/refresh data every 2hrs
fetchOrders(redisClient);
cron.schedule("0 */2 * * *", () => {
  fetchOrders(redisClient);
});

// Spin up server
app.listen(port, () => {
  console.log(`Retreiver api is listening on port ${port}`);
});
