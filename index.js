require('dotenv').load();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/db')

const HTTP_PORT = process.env.HTTP_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// dont go into production with this line
app.use(cors({ origin: '*' }));

const router = express.Router();

app.use('/api/titles', require('./src/titles/router'));

app.listen(HTTP_PORT, () => {
    console.log(`\nReady for GET requests on http://localhost: ${HTTP_PORT}`);
});
