const express = require('express')
const app = express();
const cors = require("cors");
const port = 3000;
require('dotenv').config()

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzomg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    // collections
    const tasksCollection = client.db("taskDB").collection("tasks");
    const userCollection = client.db("taskDB").collection("users");

    try {

        // add user
        app.post('/user', async (req, res) => {
            const userData = req.body;

            // check if the user if available
            const email = userData.email;
            const isAvailable = await userCollection.findOne({ email });

            if (isAvailable) {
                return res.status(409).send({ message: "User already exists" });
            }

            // if new
            const result = await userCollection.insertOne(userData);
            res.send(result);
        })

        // add a task
        app.post('/add-task', async (req, res) => {
            const { title, description, category, email, timestamp } = req.body;
            // get the last order
            const lastTask = await tasksCollection.find({ category }).sort({ order: -1 }).limit(1).toArray();

            const newOrder = lastTask.length > 0 ? lastTask[0].order + 1 : 1

            const newTask = {
                title,
                description,
                timestamp,
                category,
                order: lastTask.length > 0 ? lastTask[0].order + 1 : 1,
                email
            };
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        })

        // get all task
        app.get('/all-tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await tasksCollection.find(query).sort({ order: -1 }).toArray();
            res.send(result);
        })

        // update existing task
        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedData = req.body;
            const updatedTask = {
                $set: updatedData
            }
            const result = await tasksCollection.updateOne(filter, updatedTask);
            res.send(result);
        })

        app.patch('/task/update-order/:id', async (req, res) => {

        })

        // update category
        app.patch('/updateCategory/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const { category } = req.body;
            const updateDoc = { $set: { category: category } };
            const result = await tasksCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // delete a task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})