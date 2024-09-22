const Express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = Express();
app.use(cors());
app.use(Express.json()); // Middleware to parse JSON request bodies

const CONNECTION_STRING = "mongodb+srv://userNameRequried:passwordRequired@cluster0.cozip.mongodb.net/Metrics?retryWrites=true&w=majority";
const DATABASE_NAME = "Metrics";
let database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.error("MongoDB Connection Error:", error);
      return;
    }
    database = client.db(DATABASE_NAME);
    console.log("MongoDB Connection successful");
  });
});

// Fetch all metrics
app.get('/api/metrics', (request, response) => {
  database.collection("metrics").find({}).toArray((error, result) => {
    if (error) {
      response.status(500).send(error);
      return;
    }
    response.send(result);
  });
});

// Post new metric data
app.post('/api/metrics', (request, response) => {
  const { altitude, his, adi } = request.body;

  // Log incoming data **(ForMySelfCheck)**
  console.log("Received data:", { altitude, his, adi });

  // Validate input values
  if (
    typeof altitude !== 'number' || altitude < 0 || altitude > 3000 ||
    typeof his !== 'number' || his < 0 || his > 360 ||
    typeof adi !== 'number' || adi < -100 || adi > 100
  ) {
    response.status(400).json({ message: "Invalid input values. Please check the range." });
    return;
  }

  // Insert the new data
  database.collection("metrics").insertOne({ altitude, his, adi }, (insertError) => {
    if (insertError) {
      console.error("Error inserting new metrics:", insertError);
      response.status(500).send({ message: "Error inserting new metrics" });
      return;
    }
    response.json({ message: "Data added successfully." });
  });
});
