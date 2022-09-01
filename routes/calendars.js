const router = require("express").Router();
const verify = require("./verifyToken");
const authorize = require("./authorize");
const dayjs = require("dayjs");

// view calendar (filter dates in req.body)
router.get("/:inspectorId", verify, authorize, async (req, res) => {});

module.exports = router;
