const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors(
  {
    origin: "https://coffeeespressoo.netlify.app"
  }
));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qo68l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // connect to mongodb
    await client.connect();
    const coffeeCollection = client.db("usersDB").collection("coffees");

    // create
    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    // read
    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });
    
    app.get("/coffee/:id", async(req,res)=>{

        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result)

    })
    
    // update
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = req.body
      const updateCoffee = {
        $set: {
          name:updateDoc?.name,
          chef:updateDoc?.chef,
          supplier:updateDoc?.supplier,
          taste:updateDoc?.taste,
          category:updateDoc?.category,
          details:updateDoc?.details,
          photo:updateDoc?.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, updateCoffee,options);
      res.send(result)
    });

    // delete
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
    res.send("coffee expresoo server in running");
  });

  

app.listen(port, () => {
  console.log(`coffee espresso server is running at port: ${port}`);
});
