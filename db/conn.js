const mongoose = require("mongoose");

const db = mongoose
  .connect(
    "ADD YOUR MONGO URI HERE with Collection Name Food",
    //mongodb+srv://<username>:<password>@cluster0.kcoyy.mongodb.net/food?retryWrites=true&w=majority
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("No connection");
  });

module.exports = db;
