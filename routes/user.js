const express = require("express");
const router = express.Router();

const { register, logIn, logOut } = require("../controller/user");

router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(logOut);
// router.route("/:id").get(getUserdetails);

module.exports = router;
