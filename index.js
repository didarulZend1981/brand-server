const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";
// when start online using
// const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ckoz8fu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
      //check data insert
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })


    //All data read API
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
  })

  app.get('/coffee/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await coffeeCollection.findOne(query);
    res.send(result);
})

app.put('/coffee/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updatedCoffee = req.body;

  const coffee = {
      $set: {
          name: updatedCoffee.name, 
          quantity: updatedCoffee.quantity, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
      }
  }

      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
})

  




    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brandshop Confirmed!");
});

app.listen(port, () => {
  console.log(`Brandshop listening at http://localhost:${port}`);
});