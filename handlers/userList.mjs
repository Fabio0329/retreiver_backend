// Modules
import fetch from "node-fetch";

/**
 * Sends an array of users from cache, or directly from the Retriever API if cached data is not available in JSON format
 * @param req - HTTP request object
 * @param res - HTTP response object
 * @param redisClient - Generated Redis Client
 */

export const userList = async (req, res, redisClient) => {
  const userList = [];
  let apiPagination;
  const userListCache = await redisClient.get("userList");

  if (userListCache) {
    res.json(JSON.parse(userListCache));
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
        if (obj.purchaser_email && !userList.includes(obj.purchaser_email)) {
          userList.push(obj.purchaser_email);
        }
      });
    } while (apiPagination);
    res.json(userList.sort());
  }
};
