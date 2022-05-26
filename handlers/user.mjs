// Modules
import fetch from "node-fetch";

/**
 * Sends an array of orders related to the selected user from cache, or directly from the Retriever API if cached data is not available in JSON format
 * @param req - HTTP request object
 * @param res - HTTP response object
 * @param redisClient - Generated Redis Client
 */

export const user = async (req, res, redisClient) => {
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
    res.json(orders);
  }
};
