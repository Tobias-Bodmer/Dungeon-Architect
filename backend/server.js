const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const callHaski = require('./haski');
const port = 1337;

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

const app = express()
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.post('/registrate', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        await collection.insertOne({ email: `${mail}`, password: `${password}`, stories: [] }, () => {
        });

        res.status(200).send({
            message: `${mail} is now registrated!`
        });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: "Benutzer existiert bereits" });
        } else {
            console.error("Fehler beim Insert:", err);
            res.status(500).send({ error: `${error}` });
        }
    }
})

app.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: `${mail}` });

        if (!user.email) throw ("User not found!")
        if (user.password != password) throw ("Password incorrect!")

        res.status(200).send({
            message: `${mail} was successfully logged in!`
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})

app.post('/stories', async (req, res) => {
    try {
        const { mail } = req.body;

        if (!mail) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: `${mail}` });

        if (!user.email) throw ("User not found!")

        res.status(200).send({
            stories: user.stories
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})


app.post('/haski', async (req, res) => {
    try {
        const { advKey, message, mail } = req.body;

        if (!advKey || !message || !mail) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        var result = await callHaski(advKey, message);
        
        console.log(result);

        if (advKey == "new") {
            result = JSON.parse(result);
            collection.updateOne({ email: `${mail}` }, {
                $push: {
                    stories: {
                        headline: `${result.headline}`, description: `${result.description}`, conversationHistory: [
                            { role: 'user', content: `${message}` },
                            { role: 'assistant', content: `${result.message}` }
                        ]
                    }
                }
            });
        } else {
            collection.updateOne({ email: `${mail}` }, {
                $push: {
                    [`stories.${advKey}.conversationHistory`]: {
                        $each: [
                            { role: 'user', content: `${message}` },
                            { role: 'assistant', content: `${result}` }
                        ]
                    }
                }
            })
        }

        const user = await collection.findOne({ email: `${mail}` });

        res.status(200).send({
            answer: result,
            advKey: user.stories.length
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server has started on port: ${port}!`);
});


// app.listen(port, () => console.log(`Server has started on port: ${port}!`));