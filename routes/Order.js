const express = require("express");
const { fetchOrdersByUser, deleteOrder, updateOrder, createOrder } = require("../controller/Order");


const router = express.Router();

router
  .get("/", fetchOrdersByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);
exports.router = router;
