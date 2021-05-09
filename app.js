const express = require("express");
const app = express();
const Food = require("./models/Food.js");
const Order = require("./models/Order.js");
const db = require("./db/conn");
const { check, validationResult, body } = require("express-validator");
//Should use env variables for PORT
const PORT = 4000 || process.env.PORT;

app.use(express.json());

//GET allFoodItems
app.get("/", async (req, res) => {
  try {
    //Pagination implemented here based on input from FE

    //If the skip size to be handled at server side than we will receive page num from FE
    //  const pageSize = 3;  let us say page size to be of 3 JSON objects
    //  const skip =  for ever page more 3 elements will skip
    let pageSize = 3;
    console.log(`page size`, pageSize);
    let pageNum = parseInt(req.query.pageNum) ? parseInt(req.query.pageNum) : 1;
    let skip = pageSize * (pageNum - 1);
    console.log(`skipsize`, skip);
    let sortBy = req.query.sortBy === "desc" ? -1 : 1;

    console.log("sortBy", sortBy);
    const sortOn = req.query.sortOn ? req.query.sortOn : "Name";
    console.log(`sortON`, sortOn);

    const result = await Food.find()
      .limit(pageSize)
      .skip(skip)
      .sort({ [sortOn]: sortBy });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json([{ msg: error.message }, { type: "server error" }]);
  }
});

//POST addFoodItem to the inventory
app.post(
  "/addfood",
  [
    check("name", "Food Name is required").not().isEmpty(),
    check("price", "Food Price is required").not().isEmpty(),
    check("cuisine", "Food Cuisine is required").not().isEmpty(),
    check("quantity", "Food Quantity is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, price, cuisine, quantity } = req.body;
      let item = await Food.findOne({ name });
      console.log(item);
      if (item) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Food already exists in Inventory" }] });
      }
      let newFoodItem = req.body;
      let addFood = new Food(newFoodItem);
      console.log(addFood);
      await addFood.save();
      return res.json({ msg: "Food item added to inventory" });
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  }
);

//POST orderFood by the customer
app.post(
  "/orderfood",
  [
    check("useremail", "Customer's email is required")
      .isEmail()
      .not()
      .isEmpty(),
    check("name", "Food Name is required").not().isEmpty(),
    check("amount", "Total Bill Amount is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, quantity, amount } = req.body;
      console.log(req.body);
      const result = await Food.findOne({ name: name });
      if (result.quantity >= quantity) {
        updatedFoodItem = await Food.findOneAndUpdate(
          { name: name },
          { quantity: result.quantity - quantity }
        );
        await new Order(req.body).save();
        return res.status(200).json({ msg: "Food Ordered Successfully" });
      } else {
        return res.status(400).json({ msg: "Food Quantity Not Available" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);

//Display 404 for Rest for the Routes
app.get("*", (req, res) => {
  res.status(400).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

// const cluster = require("cluster");
// const http = require("http");
// const numCPUs = require("os").cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http
//     .createServer((req, res) => {
//       res.writeHead(200);
//       res.end("hello world\n");
//     })
//     .listen(8000);

//   console.log(`Worker ${process.pid} started`);
// }
