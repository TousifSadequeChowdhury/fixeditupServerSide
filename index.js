const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');

const uri = "mongodb+srv://tousifchowdhurybd:Z8AZkjgHdayb4TP5@cluster0.yfaue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
const database = client.db("FixedItUp");
const servicesCollection = database.collection("services");
const cartCollection = database.collection("cart");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});