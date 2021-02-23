import "reflect-metadata"
import express from "express";
import "./database"

const app = express();

app.get("/users", (req, res) => {
  return res.json({});
});

app.listen(3333, () => console.log("Running"));
