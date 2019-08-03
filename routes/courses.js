const express = require("express");
const router = express.Router();
const { Course, User } = require("../models");

router.get("/", (req, res) => {
  Course.findAll({
    attributes: ["title", "userId"],
    include: [
      {
        model: User,
        as: "user"
      }
    ]
  }).then(courses => res.json(courses));
});

router.get("/:id", (req, res) => {
  res.json({
    message: "courses"
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "users"
  });
});

router.put("/:id", (req, res) => {
  res.json({
    message: "users"
  });
});

router.delete("/", (req, res) => {
  res.json({
    message: "users"
  });
});

module.exports = router;
