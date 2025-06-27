const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const cors = require("cors");

//middlewares
server.use(cors(
  {exposedHeaders:["X-Total-Count"]}
)); //To protect users. Without it, any website could secretly make requests to any other site where you're logged in — that would be a security risk.
server.use(express.json()); //to parse req.body
server.use("/products", productsRouters.router);
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/ecommerce");
  console.log("database connected");
}
// server.post("/products", (req, res)=>{
//     createProduct()
//     res.json({status:"success"})
// })

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

// server.post("/products", createProduct); // this routing is done in routes/Products.js

server.listen(8080, () => {
  console.log("server started");
});
