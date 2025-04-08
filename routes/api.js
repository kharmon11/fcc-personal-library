/*
*
*
*       Complete the API routing below
*       
*       
*/
const Books = require('../models/Books');
'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Books.find({}).lean()
        for (let i=0; i < books.length; i++) {
          books[i]["commentcount"] = books[i].comments.length
        }
        res.json(books);
      } catch(err){
        console.log(err)
        res.send("Database error")
      }
    })
    
    .post(async function (req, res){
      const {title} = req.body;
      //response will contain new book object including atleast _id and title

      if (!title){
        return res.send("missing required field title")
      }

      try {
        const book = new Books({title})
        await book.save()
        const bookObj = book.toObject();
        delete bookObj.comments
        res.json(bookObj);
      } catch(err){
        console.log(err)
        res.send("Database error")
      }
    })
    
    .delete(async function (req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Books.deleteMany({})
        res.send("complete delete successful")
      } catch (err) {
        console.log(err)
        res.send("Database error")
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Books.findById(bookid).lean()
        if (!book) return res.send("no book exists")
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        })

      } catch (err) {
        console.log(err)
        res.send("database error")
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send("missing required field comment")

      const book = await Books.findById(bookid)
      if (!book) return res.send("no book exists")

      book.comments.push(comment)
      try {
        await book.save()
        res.json({
          _id: book.id,
          title: book.title,
          comments: book.comments
        })
      } catch (err) {
        console.log(err)
        res.send("database error")
      }
    })
    
    .delete(async function(req, res){
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deleteIssue = await Books.deleteOne({_id: bookid})

        // Check if _id was valid and a document was actually deleted
        if (deleteIssue.deletedCount === 0) {
          return res.send('no book exists');
        }
        res.send("delete successful")
      } catch (err) {
        console.log(err)
        res.send('database error');
      }
    });
  
};
