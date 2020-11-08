var express = require("express");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const sanphamDAO = require("../daos/daos");
/* GET home page. */

router.get("/", async (req, res) => {
  const sanphams = await sanphamDAO.getAllSanPham();
  res.render("home", { sanphams: sanphams });
});

router.post("/sanphams/add", async (req, res) => {

  const sanpham = {
    id: uuidv4(),
    ma_sanpham: req.body.ma_sanpham,
    ten_sanpham: req.body.ten_sanpham,
    soluong: req.body.soluong,
  };

  const success = await sanphamDAO.addSanPham(sanpham);
  if (success) {
    res.redirect("/");
  } else {
    res.status(400).send("Invalid");
  }
});

router.get('/sanphams/update/form/:id', async (req, res) => {
  const ma_sanpham = req.params.id;
  console.log(ma_sanpham);
  const sanpham = await sanphamDAO.getSingleID(ma_sanpham);
  res.render("FormUpdate", {sanpham: sanpham});
})

 router.post('/sanphams/update/:id', async (req , res) => {

   const sanpham = {
     ma_sanpham: req.params.id,
     ten_sanpham: req.body.ten_sanpham,
     soluong: req.body.soluong,
   }

   const success = await sanphamDAO.updateSanPham(sanpham);
   if (success) {
     res.redirect("/");
   } else {
     res.status(500).send(err);
   }

 })

module.exports = router;
