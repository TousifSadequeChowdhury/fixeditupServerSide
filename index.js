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

app.post('/api/data', async (req, res) => {
  const receivedData = req.body;
  console.log('Data received:', receivedData);

  try {
      const result = await servicesCollection.insertOne(receivedData);
      res.json({ message: 'Data received and inserted successfully!', receivedData });
  } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Failed to insert data', error: err.message });
  }
});  


app.get('/api/cart', async (req, res) => {
  try {
      const cartItems = await cartCollection.find({}).toArray();
      if (!cartItems.length) {
          return res.status(404).json({ message: 'No items found in the cart' });
      }
      res.status(200).json(cartItems);
  } catch (err) {
      console.error('Error fetching cart items:', err);
      res.status(500).json({ message: 'Failed to retrieve cart items', error: err.message });
  }
});
  

app.get('/api/services', async (req, res) => {
  const search = req.query?.search;
  const query = search
      ? { serviceName: { $regex: search, $options: "i" } }
      : {};
  console.log(query);

  try {
      const services = await servicesCollection.find(query).toArray();
      res.json(services);
  } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
});

app.post('/api/cart', async (req, res) => {
  const { serviceId, serviceName, price, serviceArea, userEmail, status = 'pending' } = req.body;

  try {
      const service = await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
      if (!service) {
          return res.status(404).json({ message: 'Service not found' });
      }

      const proemail = service.email;
      const cartItem = {
          serviceId,
          serviceName,
          price,
          serviceArea,
          userEmail,
          proemail,
          status,
      };

      const result = await cartCollection.insertOne(cartItem);
      res.status(201).json({ message: 'Service added to cart', cartId: result.insertedId });
  } catch (err) {
      console.error('Error adding service to cart:', err);
      res.status(500).json({ message: 'Failed to add service to cart', error: err.message });
  }
});
 

app.put('/api/cart/:itemId/status', async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  try {
      if (!['pending', 'completed', 'cancelled'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status' });
      }

      const result = await cartCollection.updateOne(
          { _id: new ObjectId(itemId) },
          { $set: { status } }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Cart item not found' });
      }

      res.json({ message: 'Status updated successfully' });
  } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
