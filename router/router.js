const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/second.html`)
})

router.get('/ind', (req, res) => {
    res.send('Some text')
})

router.get("/about", function (req, res) {
    res.send("About this wiki");
});

module.exports = router;
