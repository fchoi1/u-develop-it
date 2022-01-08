const express = require('express');
// api Routes import
const apiRoutes = require('./routes/apiRoutes');
//SQL database
const db = require('./db/connection');
// Express 
const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// api Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

// Default response for any other request:  404 error (not found)
app.get((req, res) => res.status(404).end());

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
  