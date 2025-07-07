const express = require("express");
const { fetchOrdersByUser, deleteOrder, updateOrder, createOrder, fetchAllOrders } = require("../controller/Order");


const router = express.Router();

router
  .get("/user/userId", fetchOrdersByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders)
exports.router = router;
