const express = require("express");
const app = express();
require("dotenv").config(); // lib dotenv
const port = process.env.PORT;
let customers = require("./data"); // data
// config view engine
app.set("view engine", "ejs");
app.set("views", "./views");
// config middleware
app.use(express.urlencoded({ extended: true }));
// config static files
app.use(express.static("./views"));
// router
// home
app.get("/", (req, res) => {
  res.send("Hello");
});
// phamvanhau
app.get("/phamvanhau", (req, res) => {
  res.render("index.ejs", { customers });
});
// update
app.get("/edit", (req, res) => {
  const cusId = req.query.id;
  const customer = customers.find(cus => cus.id === Number(cusId))
  res.render("edit.ejs", {customer});
});
// method
//delete
app.post("/delete", (req, res) => {
  const listCheckBoxSelected = Object.keys(req.body); // mảng gồm key và value
  if (!listCheckBoxSelected || listCheckBoxSelected.length <= 0)
    return res.redirect("/phamvanhau");
  try {
    function onDeleteItem(length) {
      const idDelete = Number(listCheckBoxSelected[length]);
      customers = customers.filter((item) => item.id !== idDelete);
      if (length > 0) return onDeleteItem(length - 1);
      return res.redirect("/phamvanhau");
    }
    onDeleteItem(listCheckBoxSelected.length - 1);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error!");
  }
});
// save
app.post("/save", (req, res) => {
  try {
    // lay toan bo du lieu tu form
    const id = Number(req.body.id);
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const total = Number(req.body.total);
    const params = {
      id: Number(id),
      name: name,
      email: email,
      address: address,
      total: Number(total),
    };
    customers.push(params);
    return res.redirect("/phamvanhau");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error!");
  }
});
app.post("/edit", (req, res) => {
  // lay du lieu moi
  const id = Number(req.body.id)
  const name = req.body.upName
  const email = req.body.upEmail
  const address = req.body.upAddress
  const total = Number(req.body.upTotal)

  const index = customers.findIndex(cus => cus.id === Number(id))
  if(index === -1)
  return res.status(404).send("Internal Server Error!")
  customers[index].name = name
  customers[index].email = email
  customers[index].address = address
  customers[index].total = total

  return res.redirect("/phamvanhau")
})
// listen
app.listen(port, () => {
  console.log(`Example ap on for port ${port}`);
});
