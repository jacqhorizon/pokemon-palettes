const path = require('path')
const express = require('express')
const mysql = require('mysql')
//Heroku sets this value when deployed, otherwise runs on port 3001
const PORT = process.env.PORT || 3001

const app = express()

// var connection = mysql.createConnection({
//   host: 'poke-palette-db.cbygkpyx6qob.us-east-2.rds.amazonaws.com',
//   user: 'admin',
//   password: 'GreenD0g!',
//   port: 3306,
//   database: 'test_schema'
// })

// app.get('/new-table', (req, res) => {
//   connection.connect(function(err) {
//     connection.query(`SELECT * FROM new_table`, function(err, result, fields) {
//       if (err) res.send(err);
//       if (result) res.json({data: result});
      
//     })
//   })
// })


// connection.connect(function(err) {
//   if (err) {
//     console.log('Database connection failed:'+ err.stack)
//     return
//   }
//   console.log('Connected to database.')
// })
// connection.end()

// connection.connect(function(err) {
//   if (err) throw err;

//   connection.query('CREATE DATABASE IF NOT EXISTS main;');
//   connection.query('USE main;');
//   connection.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), age int, PRIMARY KEY(id));', function(error, result, fields) {
//       console.log(result);
//   });
//   connection.end();
// });

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

// Handle GET requests to /api route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' })
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  connection.end();
  // some other closing procedures go here
  process.exit( );
})