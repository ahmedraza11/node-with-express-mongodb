const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Static directory
app.use(express.static('public'));

apiRoutes(app, db);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running");
    });
});