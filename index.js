const express = require('express');
const path = require('path');
const app = express();

// Set a static folder (for HTML, CSS and JS files that are public)
app.use(express.static(path.join(__dirname, 'public')));

// Photos API Routes. Initiliazing router. First param is route that we want (web page path),
// and second parameter is requiring file that handles the routes and logic.
app.use('/api/photos', require('./routes/api/photos'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));