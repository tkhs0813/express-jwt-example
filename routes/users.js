const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const utils = require("../lib/utils");

router.post("/login", function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: "could not find user" });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/register", function (req, res, next) {
  const { salt, hash } = utils.genPassword(req.body.password);

  const newUser = new User({
    usename: req.body.username,
    hash,
    salt,
  });

  try {
    newUser.save().then((user) => {
      res.json({ success: true, user: user });
    });
  } catch (e) {
    res.json({ success: false, msg: e });
  }
});

module.exports = router;
