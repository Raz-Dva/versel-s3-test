const http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    { S3 } = require("@aws-sdk/client-s3"),
    fs = require('fs'),
    path = require('path'),
    region = 'eu-north-1',
    accessKeyId = 'AKIA2P4W6M4QZFVWSUPP',
    secretAccessKey = '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',
    bucketName = 'nikkiblog-bucket',
    multer = require('multer'),
    upload = multer({ storage: multer.memoryStorage()}),
    port = 9003;
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");


const client = new S3Client({
        credentials: {
            accessKeyId,
            secretAccessKey
        },
        region
    });


function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path, (err, req) => {
        if(err) console.log(err);
    })
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return  client.send(new PutObjectCommand(uploadParams));

    // new Upload({
    //     client,
    //     params: uploadParams
    // })
    //     .done()
    //     .then(data => {
    //         return data;
    //     }).catch((err) => {
    //         // console.log('ERROR', err);
    //     });
}

// S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
// Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
// s3.upload(params,
// function (err, data) {
//     //handle error
//     if (err) {
//         console.log("Error s3 upload", err);
//     }
//     //success
//     if (data) {
//         console.log("Uploaded in:", data.Location);
//     }
// }
// );
// app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/second.html`)
})

app.get('/image/:key', async (req, res) => {

    const fileKey = req.params.key;
    console.log(fileKey)
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    try{
        const command = new GetObjectCommand(downloadParams)
        const s3Item = await client.send(command)
        // console.log("> Content received.")
        //
        // s3Item.Body.pipe(fs.createWriteStream(res));

    }
    catch (err){
        console.log('ERR+++', err);
    }
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
        console.log(result['$metadata'].httpStatusCode);
        if (result['$metadata'].httpStatusCode === 200) {
            const URL = `https://${bucketName}.s3.${region}.amazonaws.com/${command.input.Key}`
            console.log(URL);
            return res.send({imageURL: URL})
        } else {
            console.log();
            return res.status(error?.status || 400).send( 'Error from server')
        }
        // result = await uploadFile(file);
        // await unlinkFile(file.path)
    } catch(error){
        console.log(error)
        return res.status(error?.status || 400).send( 'Error from server')
    }
});

server.listen(process.env.PORT || port, () => {
    console.log(`Server is run on port ${process.env.PORT || port}`);
});
