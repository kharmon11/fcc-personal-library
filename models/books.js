const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    title: String,
    comments: [String],
})

const Books = mongoose.model('Books', BooksSchema);

module.exports = Books;