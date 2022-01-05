const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

// Default response for any other request:  404 error (not found)
app.get((req, res) => res.status(404).end());

app.listen(PORT, () => {
    console.log(`Server is runnign on port ${PORT}`)
});