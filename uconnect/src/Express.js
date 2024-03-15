
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://uconnect:uconnect123@uconnectdb.xi1eihr.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//     try {
//       // Connect the client to the server
//       await client.connect();
  
//       // Specify the database and collection
//       const db = client.db('test');
//       const collection = db.collection('devices');
  
//       // Create a document to be inserted
//       const doc = { item: "diamond", qty: 116 };
  
//       // Insert the document into the collection
//       const result = await collection.insertOne(doc);
  
//       console.log(`Successfully inserted item with _id: ${result.insertedId}`);
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
  
//   run().catch(console.dir);



const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));

const uri = "mongodb+srv://uconnect:uconnect123@uconnectdb.xi1eihr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.post('/api/events', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('create_events');
    const collection = db.collection('events');

    const eventData = req.body; // Assuming your React app sends a JSON object with the event data

    const result = await collection.insertOne(eventData);

    console.log(`Successfully inserted event with _id: ${result.insertedId}`);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.status(201).send({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Error inserting event:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
