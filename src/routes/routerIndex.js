const router = require("express").Router();

router.use("/auth", require("./authRouter"));
router.use("/customers", require("./customerRouter"));
router.use("/flights", require("./flightRouter"));
router.use("/bookings", require("./bookingRouter"));


module.exports = router;