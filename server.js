const express = require('express');
const morgan = require('morgan');
const path = require('path');
const request = require('request');
const app = express();
const port = process.env.PORT || 3000;
const db = require('../all\ components/Thom/database/index.js')

app.use('/', express.static('./public'));
app.use(/\/\d+\//, express.static('./public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// jane's component
app.use('/api/jane/player/:id', (req, res) => {
  var url = `http://localhost:5000/api/jane/player/${req.params.id}`;
  req.pipe(request(url)).pipe(res);
});

// steven's component
app.use('/api/songs-info/:id', (req, res) => {
  var url = `http://localhost:3001/api/songs-info/${req.params.id}`;
  req.pipe(request(url)).pipe(res);
});

// justin's component
app.use('/:id', (req, res) => {
  console.log('yo');
  var url = `http://localhost:3004/${req.params.id}`;
  req.pipe(request(url)).pipe(res);
});

// thom's component
app.get('/api/thom/comments', (req, res) => {
  console.log('what?')
  db.GetAllComments( 
    (err,comments) => {
      if (err) {throw err}
      else {res.send(comments);}
    }
  );
 
});

app.get('/api/thom/singleComment', (req,res) => {
  console.log("comment id: ",req.query);
  db.GetOneComment(req.query.commentId,
    (err,comment) => {
      if (err) {throw err}
      else {res.send(comment)}
    }
  );
})

app.post('/api/thom/comments', (req,res) => {
  db.AddOne(req.body,
    (err,comment) => {
      if (err) {console.log('error in express');throw err;}
      else {
        console.log(comment);
        res.send(200,comment.insertId)}
        // ^ Send insertId to client
        // so that client can automatically add the correct comment
    }
  )
})



// app.use('/api/tracks', (req, res) => {
//   var url = 'http://localhost:3003/api/singleComment';
//   req.pipe(request(url)).pipe(res);
// });

// app.use('/api/tracks', (req, res) => {
//   var url = 'http://localhost:3003/api/comments';
//   req.pipe(request(url)).pipe(res);
// });

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
