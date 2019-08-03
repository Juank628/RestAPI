const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const auth = require("basic-auth");

const authenticateUser = (req, res, next) => {
  const credentials = auth(req);
  if (credentials) {
    User.findOne({ where: { emailAddress: credentials.name } }).then(user => {
      if (user) {
        const authenticated = bcrypt.compareSync(
          credentials.pass,
          user.password
        );
        if (authenticated) {
          req.logedUser = user;
          next();
        } else {
          res.status(401).json({ error: "access denied" });
        }
      } else {
        res.status(401).json({ error: "user does not exist" });
      }
    });
  } else {
      res.status(401).json({error: "no credentials received"})
  }
};

router.get("/", authenticateUser, (req, res) => {
  res.json({
    firstName: req.logedUser.firstName,
    lastName: req.logedUser.lastName,
    email: req.logedUser.emailAddress
  });
});

router.post("/", (req, res) => {
  const user = req.body;

  User.findOne({ where: { emailAddress: user.emailAddress } }).then(user => {
      if(user){
        res.status(409).json({error: "the user alredy exist"})
      } else {
        user.password = bcrypt.hashSync(user.password);
        User.create(user).then(() => res.status(201).end());
      }
  })
});

module.exports = router;
