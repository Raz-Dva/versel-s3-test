const express = require("express");
const router = express.Router();

router.get('/second', (req, res) => {
    res.sendFile(`${process.cwd()}/public/second.html`)
})

router.get('/ind', (req, res) => {
    res.send('Some text')
})

router.get("/about", function (req, res) {
    res.send("About this wiki");
});

module.exports = router;
