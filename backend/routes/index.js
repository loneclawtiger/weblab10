const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//connect db
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wsdlab10"
});

conn.connect((err)=>{
  if (err) throw err;
  console.log('MYSQL Connected');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getData', (req,res)=>{
  let selectSQL = "select * from users";

  conn.query(selectSQL, (err, rows)=>{
    if (err) throw err;
    res.send(rows);
  });
});

//get user data for editing
router.get('/getUser', (req,res)=>{
  let id = req.query.id;
  let selectSQL = `select * from users where id = ${id}`;

  conn.query(selectSQL, (err,rows)=>{
    if (err) throw err;
    res.send(rows);
  });
});

//user edit
router.post('/editUser', (req,res)=>{
  let {newName, newCat, newRat, edID} = req.body;

  let upSQL = `UPDATE users set name = '${newName}', category = '${newCat}', rating = ${newRat} where id = ${edID}`;

  conn.query(upSQL, (err)=>{
    if (err) throw err;
    res.send('success');
    console.log('update success');
  })
});


//delete user
router.get("/deleteCat", (req,res)=>{
  let id = req.query.id;

  let delSQL = `delete from users where id = ${id}`;

  conn.query(delSQL, (err)=>{
    if (err) throw err;
    res.send('Deleted');
    console.log('Deleted');
  })
});


//add user
router.post('/addUser', (req,res)=>{
  let {addName, addCat, addRat} = req.body;

  let inSQL = `insert into users values(NULL, '${addName}', '${addCat}', ${addRat})`;

  conn.query(inSQL, (err)=>{
    if(err) throw err;
    res.send('Added');
    console.log('Added');
  })
});

//search
router.get('/search', (req,res)=>{
  let search = req.query.search;

  let srSQL = `select * from users where name like '%${search}%' or category like '%${search}%'`;

  conn.query(srSQL, (err,rows)=>{
    if (err) throw err;

    res.send(rows);
    console.log(rows);
  })
});

module.exports = router;
