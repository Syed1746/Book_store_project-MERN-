import express from "express"
import { port, mongodburl } from "./config.js"
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
const app = express()
app.use(express.json());
app.get('/', (req, res) => {
    res.send('dont blame on errros, errors make u proud')
});
app.post('/books', async(req, res) => {
    try {
        if (!req.body.title || !req.body.authors || !req.body.publishYear) {
            return res.status(400).send({
                message: 'Required fields are title, authors, and publishYear',
                requestBody: req.body
            });
        }

        const newBook = {
            title: req.body.title,
            authors: req.body.authors,
            publishYear: req.body.publishYear
        }

        const book = await Book.create(newBook);
        res.send(book);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Internal Server Error',
            error: err.message,
            requestBody: req.body
        });
    }
});
app.get('/books', async(req, res) => {
        try {
            const book = await Book.find({});
            res.json({
                count: book.length,
                data: book
            });
        } catch (err) {
            console.log(err.message);
            res.send(err.message);
        }
    })
    // route to get one book by using id in the mongoose
app.get('/books/:title', async(req, res) => {
    try {
        const { title } = req.params;
        const book = await Book.findOne({ title: title });
        res.json(book);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
})



mongoose
    .connect(mongodburl)
    .then(() => {
        console.log('connected successfully');
    })

.catch((error) => {
    console.log(error);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})