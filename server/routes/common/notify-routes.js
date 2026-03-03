const express = require("express");
const { sendVisitNotification } = require("../../controllers/common/notify-controller");

const router = express.Router();

router.post("/visit", sendVisitNotification);

module.exports = router;
