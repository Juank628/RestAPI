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
  Course.findOne({
    where: { id: req.params.id },
    attributes: ["title", "userId"],
    include: [{ model: User, as: "user" }]
  }).then(course => {
    if (course) {
      res.json({ course });
    } else {
      res.status(404).json({ error: "course not found" });
    }
  });
});

router.post("/", (req, res) => {
  const reqCourse = req.body;

  Course.findOne({ where: { title: reqCourse.title } }).then(foundCourse => {
    if (foundCourse) {
      res.status(409).json({ error: "the course alredy exist" });
    } else {
      Course.create(reqCourse)
      .then(() => res.status(201).end())
      .catch(err => {
        let errors = []
        err.errors.forEach(error => errors.push(error.message))
        res.status(400).json({errors: errors})
    });
    }
  });
});

router.put("/:id", (req, res) => {
  const reqCourse = req.body;

  Course.findByPk(req.params.id).then(foundCourse => {
    if (foundCourse) {
      foundCourse.update(reqCourse)
      .then(() => res.status(204).end())
      .catch(err => {
        let errors = []
        err.errors.forEach(error => errors.push(error.message))
        res.status(400).json({errors: errors})
    });
    } else {
      res.status(404).json({ error: "course not found" });
    }
  });
});

router.delete("/:id", (req, res) => {
  Course.findByPk(req.params.id).then(foundCourse => {
    if (foundCourse) {
      foundCourse.destroy().then(() => res.status(204).end());
    } else {
      res.status(404).json({ error: "course not found" });
    }
  });
});

module.exports = router;
