const http = require('http'),
    express = require('express'),
    app = express(),
    // server = http.createServer(app),
    // { S3 } = require("@aws-sdk/client-s3"),
    // fs = require('fs'),
    path = require('path'),
    region = 'eu-north-1',
    accessKeyId = 'AKIA2P4W6M4QZFVWSUPP',
    secretAccessKey = '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',
    bucketName = 'nikkiblog-bucket',
    multer = require('multer'),
    upload = multer({ storage: multer.memoryStorage()}),
    // router = require('./router/router'),
    pathPublic = path.join(__dirname, 'public'),
    port = 3000;
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({
        credentials: {
            accessKeyId,
            secretAccessKey
        },
        region
    });


// app.use(express.static(__dirname));
// app.use('/', express.static(__dirname));
// app.use(express.static('public'));

// app.use('/', router);
// router.get('/', (req, res) => {
//     res.sendFile(`${process.cwd()}/second.html`)
// })
//
// router.get('/ind', (req, res) => {
//     res.send('Some text')
// })
//
// router.get("/", function (req, res) {
//     res.send("Wiki home page");
// });
//
// router.get("/about", function (req, res) {
//     res.send("About this wiki");
// });

// app.get('/image/:key', async (req, res) => {
//
//     const fileKey = req.params.key;
//     console.log(fileKey)
//     const downloadParams = {
//         Key: fileKey,
//         Bucket: bucketName
//     }
//
//     try{
//         const command = new GetObjectCommand(downloadParams)
//         const s3Item = await client.send(command)
//         // console.log("> Content received.")
//         //
//         // s3Item.Body.pipe(fs.createWriteStream(res));
//
//     }
//     catch (err){
//         console.log('ERR+++', err);
//     }
// });
//
// server.listen(process.env.PORT || port, () => {
//     console.log(`Server is run on port ${process.env.PORT || port}`);
// });

// const express = require('express');
// const app = express();
// const path = require('path');

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', );
})

app.get('/second', (req, res) => {
    res.sendFile('second.html', {root: pathPublic});
})

app.get("/about", function (req, res) {
    res.send("<h1>About Page</h1>");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is run on port ${process.env.PORT || port}`);
});


app.post('/image', upload.single('image'), async (req, res) => {

    try{
        const file = req.file;
        const params = {
            Bucket: bucketName,
            Body: file.buffer,
            Key: 'id_' + (new Date().getTime()) + '_' + file.originalname, // add post id instead of name
            ContentType: file.mimetype,
        };
        const command = new PutObjectCommand(params);
        const result = await client.send(command);

        if (result['$metadata'].httpStatusCode === 200) {
            const URL = `https://${bucketName}.s3.${region}.amazonaws.com/${command.input.Key}`
            // console.log(URL);
            return res.send({imageURL: URL})
        } else {

            return res.status(error?.status || 400).send( 'Error from server')
        }
    } catch(error){
        console.log(error)
        return res.status(error?.status || 400).send( 'Error from server')
    }
});

module.exports = app;
