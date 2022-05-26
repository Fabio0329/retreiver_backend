// Modules
import { timeStamp } from "../utils/timeStamp.mjs";
import fetch from "node-fetch";

/**
 * Fetches data from the Retriever API and caches it - {userList: [], orders: []}
 * @param redisClient - Generated Redis Client
 */

export const fetchOrders = async (redisClient) => {
  const formattedOrders = {};
  const userList = [];
  let numOfCalls = 0;
  let apiPagination;

  do {
    try {
      const response = await fetch(
        apiPagination ||
          "https://app.helloretriever.com/api/v1/device_returns/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.RETREIVER_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      apiPagination = data.next;
      data.results.forEach((order) => {
        if (formattedOrders[order.purchaser_email]) {
          formattedOrders[order.purchaser_email].push(order);
        } else {
          formattedOrders[order.purchaser_email] = [order];
        }
      });
      numOfCalls++;
    } catch (e) {
      console.log(e);
    }
  } while (apiPagination);

  for (let key in formattedOrders) {
    userList.push(key);
  }
  await redisClient.set("userList", JSON.stringify(userList.sort()));
  await redisClient.set("orders", JSON.stringify(formattedOrders));
  console.log(`${timeStamp(new Date())} - # of API Calls: ${numOfCalls}`);
};
