const { getS3UploadParams } = require('./s3');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/client'));

app.get('/get-upload-params', (request, response) => {
    let filename = request.query.filename;
    if (filename) {
        response.set("Content-Type", "application/json");
        response
            .status(200)
            .send(JSON.stringify(getS3UploadParams({ filename: filename, contentType: request.query.content_type })));
    } else {
        response
            .status(400)
            .send("No filename given");
    }

});

app.listen(3030, () => console.log("Listening om port 3030"));
