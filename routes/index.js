var express = require("express");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const dienvienDAO = require("../daos/daos");
/* GET home page. */

router.get("/", async (req, res) => {
  const dienviens = await dienvienDAO.getAllDienVien();
  res.render("home", { dienviens: dienviens });
});

router.post("/dienviens/add", async (req, res) => {
  let files = req.files;
  let avatar = await files.avatar;
  const uploadS3 = await dienvienDAO.uploadAvatar(avatar);

  const dienvien = {
    id: uuidv4(),
    ma_dienvien: req.body.ma_dienvien,
    ten_dienvien: req.body.ten_dienvien,
    namsinh: req.body.namsinh,
    avatar: uploadS3,
  };

  const success = await dienvienDAO.addDienVien(dienvien);
  if (success) {
    res.redirect("/");
  } else {
    res.status(400).send("Invalid");
  }
});

router.get("/dienviens/delete/:id", async (req, res) => {
  const ma_dienvien = req.params.id;
  const success = await dienvienDAO.deleteDienVien(ma_dienvien);
  if (success) {
    res.redirect("/");
  } else {
    res.status(500).send(err);
  }
});

router.get('/dienviens/update/form/:id', async (req, res) => {
  const ma_dienvien = req.params.id;
  const dienvien = await dienvienDAO.getSingleID(ma_dienvien);
  res.render("FormUpdate", {dienvien: dienvien});
})

router.post('/dienviens/update/:id', async (req , res) => {
  let files = req.files;
  let avatar = await files.avatar;
  const uploadS3 = await dienvienDAO.uploadAvatar(avatar);

  const dienvien = {
    ma_dienvien: req.params.id,
    ten_dienvien: req.body.ten_dienvien,
    namsinh: req.body.namsinh,
    avatar: uploadS3,
  }

  const success = await dienvienDAO.updateDienvien(dienvien);
  if (success) {
    res.redirect("/");
  } else {
    res.status(500).send(err);
  }

})

module.exports = router;
