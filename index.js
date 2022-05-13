const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
const cors = require('cors');

AWS.config.update({region: 'eu-west-2'});
const cwevents = new AWS.CloudWatchEvents({apiVersion: '2015-10-07'});

app.get('/', (req, res) => {
    res.send('Express init');
});

let books = [{
    "isbn": "9781593275846",
    "title": "Eloquent JavaScript, Second Edition",
    "author": "Marijn Haverbeke",
    "publish_date": "2014-12-14",
    "publisher": "No Starch Press",
    "numOfPages": 472,
},
{
    "isbn": "9781449331818",
    "title": "Learning JavaScript Design Patterns",
    "author": "Addy Osmani",
    "publish_date": "2012-07-01",
    "publisher": "O'Reilly Media",
    "numOfPages": 254,
},
{
    "isbn": "9781449365035",
    "title": "Speaking JavaScript",
    "author": "Axel Rauschmayer",
    "publish_date": "2014-02-01",
    "publisher": "O'Reilly Media",
    "numOfPages": 460,
}];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/book', (req, res) => {
    const book = req.body;
    console.log('Book added: ' + book);
    books.push(book);
    res.send('Book is added to the database');
});

app.get('/book', (req, res) => {
    res.json(books);
});

app.get('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    for (let book of books) {
        if (book.isbn === isbn) {
            res.json(book);
            return;
        }
    }
    res.status(404).send('Book not found');
});

app.delete('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    books = books.filter(i => {
        if (i.isbn !== isbn) {
            return true;
        }

        return false;
    });
    res.send('Book is removed from the database');
});

app.post('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const newBook = req.body;
    for (let i = 0; i < books.length; i++) {
        let book = books[i]
        if (book.isbn === isbn) {
            books[i] = newBook;
        }
    }
    res.send('Book is edited in the database');
});

const params = {
    Name: 'SAMPLE_EVENT',
    RoleArn: 'arn:aws:iam::917287481518:role/STAAssumeRole',
    ScheduleExpression: 'rate(5 minutes)',
    State: 'ENABLED'
  };
  
  cwevents.putRule(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.RuleArn);
    }
  });

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
