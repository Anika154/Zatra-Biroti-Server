
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urlm5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('zatra-biroti');
        const packagesCollection = database.collection('packages');
        const bookingsCollection = database.collection('booking');


        //GET API for packages
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        //GET API for booking
        app.get('/booking', async (req, res) => {
            if (req.query.email) {
                const email = req.query.email;
                const cursor = bookingsCollection.find({ email: email });
                const booking = await cursor.toArray();
                res.send(booking);

            }
            else {
                const cursor = bookingsCollection.find({});
                const booking = await cursor.toArray();
                res.send(booking);
            }
        });



        //GET single package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        });

        //Delete API
        app.delete('/booking', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);

        });

        //PUT API
        app.put('/booking', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await bookingsCollection.updateOne(query, updateDoc);
            res.json(result);
        });


        //POST API for package
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the post api', package);

            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.send(result)
        });

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log('hit the post api', booking);

            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.send(result)
        });
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server')
});

app.listen(port, () => {
    console.log('Running Tourism Server', port);
})