import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users")
  .then(() => console.log("MongoDB connected!"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  const query = {};
  if (name) query.name = name;
  if (job) query.job = job;
  userModel
    .find(query)
    .then(users => res.json({ users_list: users }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/users/:id", (req, res) => {
  userModel
    .findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post("/users", (req, res) => {
  const newUser = new userModel(req.body);
  newUser
    .save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.delete("/users/:id", (req, res) => {
  userModel
    .findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(204).send();
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/", (req, res) => {
  res.send("Hi mom!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default {
  addUser: (user) => new userModel(user).save(),
  getUsers: (name, job) => userModel.find({ ...(name && { name }), ...(job && { job }) }),
  findUserById: (id) => userModel.findById(id),
  findUserByName: (name) => userModel.find({ name }),
  findUserByJob: (job) => userModel.find({ job }),
};
