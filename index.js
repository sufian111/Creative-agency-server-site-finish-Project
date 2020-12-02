const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World e!");
});

const uri =
  "mongodb+srv://admin:admin@cluster0.behuk.mongodb.net/creative-agency-finished?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db("creative-agency-finished")
    .collection("all-services");

  const reviewCollection = client
    .db("creative-agency-finished")
    .collection("all-review");

  const orderCollection = client
    .db("creative-agency-finished")
    .collection("all-order-list");
  // perform actions on the collection object
  console.log("connect");

  app.post("/userOrderList", (req, res) => {
    //---------------- get a users Ordered Items by email
    orderCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // get the review collection

  app.get("/review", (req, res) => {
    reviewCollection.find({}).toArray((err, result) => {
      res.send(result);
    });
  });

  //   review add api

  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review, (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ status: "document added" });
      }
    });
  });

  //   order add api

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: "document added" });
      }
    });
  });

  // add services

  app.post("/addService", (req, res) => {
    const service = req.body;
    console.log(service);
    serviceCollection.insertOne(service, (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ status: "document added" });
      }
    });
  });

  // all services

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, result) => {
      res.send(result);
    });
  });
});

////get user order details

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
