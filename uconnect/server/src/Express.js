const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// Posting an Event
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

// Getting an Event
app.get('/api/events', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('create_events');
    const collection = db.collection('events');

    // Assuming you want to retrieve all events from the collection
    const events = await collection.find().toArray();

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

// Requesting to join an event
app.post('/api/events/:eventId/join', async (req, res) => {
  const { eventId } = req.params;
  const { userEmail } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add the user's email to the participants array
    event.participants.push(userEmail);
    await event.save();

    console.log(`User ${userEmail} joined event ${eventId}`);
    res.status(200).json({ message: 'Join request successful', event: event });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


