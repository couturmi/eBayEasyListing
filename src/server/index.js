/**
 * Created by mitchcout on 6/6/2017.
 */

const express = require('express');
const fileUpload = require('express-fileupload');
var proxy = require('express-http-proxy');
const opn = require('opn');
var findRemoveSync = require('find-remove');
const app = express();
const port = 8080;

//cleanup old temp files
findRemoveSync('./src/img/temp/photoUploads', {files: ['*.*']})

//for uploading images
app.use(fileUpload());
app.post('/upload', function(req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. 'addPhoto') is used to retrieve the uploaded file
    let addPhoto = req.files.addPhoto;

    // Use the mv() method to place the file in a temporary folder on the server
    addPhoto.mv('./src/img/temp/photoUploads/'+addPhoto.name, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

/* Starting page */
app.use('/', express.static('./src' + '/'));
app.use('/ebayApiSandbox', proxy('https://api.sandbox.ebay.com'));
app.use('/ebayShoppingApiSandbox', proxy('http://open.api.sandbox.ebay.com'));
app.use('/ebayApiProd', proxy('https://api.ebay.com'));

app.listen(port, (err) => {
    if (err) {
        return console.log('ERROR: Could not start server', err);
    }

    console.log(`Success: server listening on port - ${port}`);

    /* ------ Open browser window ------ */
    console.log('Opening browser');
    opn('http://localhost:8080');
    console.log('Application opened successfully');
});