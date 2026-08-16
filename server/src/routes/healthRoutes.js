const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "StreamSphere API is healthy",
    });
});

module.exports = router;