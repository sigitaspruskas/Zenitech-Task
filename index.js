const http = require('http');
const path = require('path');
const fs = require('fs');

// We're creating a server, that gets request and response everytime a file is sent.
const server = http.createServer((req, res) => {
    // // Checking if request url is the api page...
    // if (req.url === '/api/users') {
    //     // hardcoded example of data (array isntead of fetched data)
    //     const users = [
    //         { name: 'John' },
    //         { name: 'Sara' }
    //     ];
    //     // its JSON content, so we set the according content type
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     // lets turn JS array of objects in to JSON
    //     res.end(JSON.stringify(users));
    // }

    // Build file path. We're gonna evaluate, what is the value of 'req.url'. 
    // If it's index (or '/'), load index.html, else load value of "req.url".
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)

    // Getting the Extension of the file
    let extName = path.extname(filePath);

    // Initial content type for the response Headers
    let contentType = 'text/html';

    // Check and evaluating extension of the file, and set correct content type for the response Headers.
    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg'
            break;
    };

    // Read File
    fs.readFile(filePath, (err, content) => {
        // Error handler
        if (err) {
            if (err.code == 'ENOENT') {
                // checks for a specific error 'page is not found'
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                // then mostly some server error
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            // No error, response is successful
            // write to the Headers:
            // setting 200 status means everything is okay, we also set response headers content type
            res.writeHead(200, { 'Content-Type': contentType });

            // outputs the content of the file that was read (serves the html page)
            res.end(content, 'utf8');
        }

    })
});

// if envirenmental port is not found, it wil rn on 5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));