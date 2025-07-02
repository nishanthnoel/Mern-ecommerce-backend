const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const orders = await Order.find({ user: user })
      .populate("user")
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    // const result = await doc.populate("product");
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,  // it returns the updated document instead of the others.
    });
    // const result = await cart.populate("product");

    // console.log("cart", result)
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

