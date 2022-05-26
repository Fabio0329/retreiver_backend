import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cron from "node-cron";
import { createClient } from "redis";
import { fetchOrders } from "./controllers/fetchOrders.mjs";

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));

await redisClient.connect();

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get("/api/user/:username", async (req, res) => {
  const orders = [];
  let apiPagination;
  const ordersCache = await redisClient.get(`orders`);

  if (ordersCache) {
    res.json(JSON.parse(ordersCache)[req.params.username]);
  } else {
    do {
      const fetch_resp = await fetch(
        apiPagination ||
          "https://app.helloretriever.com/api/v1/device_returns/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.RETREIVER_API_KEY}`,
          },
        }
      );
      const json_data = await fetch_resp.json();
      apiPagination = json_data.next;
      json_data.results.forEach((obj) => {
        if (obj.purchaser_email === req.params.username) {
          orders.push(obj);
        }
      });
    } while (apiPagination);

    redisClient.setEx(
      `orders_${req.params.username}`,
      1800,
      JSON.stringify(orders)
    );
    res.json(orders);
  }
});

app.get("/api/userList", async (req, res) => {
  const userList = ["fabio.restrepo@opendoor.com"];
  const userListCache = await redisClient.get("userList");

  if (userListCache) {
    res.json(JSON.parse(userListCache));
  } else {
    const fetch_resp = await fetch(
      "https://app.helloretriever.com/api/v1/device_returns/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.RETREIVER_API_KEY}`,
        },
      }
    );
    const json_data = await fetch_resp.json();
    json_data.results.forEach((obj) => {
      if (obj.purchaser_email && !userList.includes(obj.purchaser_email)) {
        userList.push(obj.purchaser_email);
      }
    });
    redisClient.setEx("userList", 3600, JSON.stringify(userList));
    res.json(userList);
  }
});

fetchOrders(fetch, redisClient);
cron.schedule("0 */2 * * *", () => {
  fetchOrders(fetch, redisClient);
});

app.listen(port, () => {
  console.log(`Retreiver api is listening on port ${port}`);
});
