/**
 * Created by mitchcout on 6/6/2017.
 */

const express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
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

app.post('/updateUserShippingDetails', function(req, res) {
    if (!req.body) {
        return res.status(400).send('No data received.');
    }

    //get data
    let shippingDetails = req.body.shippingDetails;

    //write data to file
    var writer = fs.createWriteStream('./src/properties/userDetails/shippingDetails.json');
    writer.write(shippingDetails, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('User Shipping Details updated!');
    });
});

/* proxy values */
app.use('/', express.static('./src' + '/'));
app.use('/ebayApiSandbox', proxy('https://api.sandbox.ebay.com'));
app.use('/ebayShoppingApiSandbox', proxy('http://open.api.sandbox.ebay.com'));
app.use('/ebayApiSignInSandbox', proxy('https://signin.sandbox.ebay.com'));

app.use('/ebayApiProd', proxy('https://api.ebay.com'));
app.use('/ebayShoppingApiProd', proxy('http://open.api.ebay.com'));
app.use('/ebayApiSignInProd', proxy('https://signin.ebay.com'));

/* Starting page */
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