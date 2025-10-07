const router = require('express').Router();

const mongoose = require("mongoose");

router.get('/', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  if (!dbConnected) {
    return res.status(500).json({
      status: "error",
      uptime: process.uptime(),
      db: "disconnected",
    });
  }

  res.json({
    status: "ok",
    uptime: process.uptime(),
    db: "connected",
  });
});



module.exports = router;
