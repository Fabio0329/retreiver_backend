import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get("/api/user/:username", async (req, res) => {
  const orders = [];
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
    if (obj.purchaser_email === req.params.username) {
      orders.push(obj);
    }
  });

  res.send(orders);
});

app.get("/api", async (req, res) => {
  const userObj = { users: [] };

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
    if (obj.purchaser_email && !userObj.users.includes(obj.purchaser_email)) {
      userObj.users.push(obj.purchaser_email);
    }
  });
  res.send(userObj);
});

app.listen(port, () => {
  console.log(`Retreiver api is listening on port ${port}`);
});
