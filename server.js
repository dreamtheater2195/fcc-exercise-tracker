const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const {mongoose} = require('./db/mongoose')
const moment = require('moment')
const {User} = require('./models/user');
const {Post} = require('./models/post');
const shortid = require('shortid');
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//new user 
app.post('/api/exercise/new-user', (req, res) => {
  const { username } = req.body;
  User.findOne({username}, (err, user) => {
    if (user) {
      return res.status(422).send("Username has already been taken");
    }
    const newUser = new User({
      username: username,
      _id: shortid.generate()
    });
    newUser.save((err, doc) => {
      if (err) {
        return res.json({
          error: err
        });
      }
      res.json(doc);
    });
  });
});

app.post('/api/exercise/add', (req, res) => {
  const {userId, description, duration, date} = req.body;
  
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    const newPost = new Post({
      _userId: userId, description, duration, date: moment(date).format("YYYY-MM-DD")
    });
    newPost.save((err, doc) => {
      if (err) {
        return res.json({
          error: err
        });
      }
      res.json(doc);
    });
  });
});

app.get('/api/exercise/log', (req, res) => {
  console.log(req.query);
  const {userId, from, to, limit} = req.query;
  
  User.findById(userId, (err, user) => {
      if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    let query = {
      _userId: userId
    }
    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = moment(from).format('YYYY-MM-DD');
      }
      if (to) {
        query.date.$lte = moment(to).format('YYYY-MM-DD');
      }
    }
    Post.find(query).sort({ 'date': -1 }).limit(parseInt(limit))
    .then(result => res.json(result))
    .catch(err => res.send(err));
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
