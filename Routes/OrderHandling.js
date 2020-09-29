const router = require("express").Router();
const { doAuthToken } = require("../Helper/jwt");
const { getCollection } = require("../Helper/db");
const { dateNow, doFormat } = require("../Helper/response");
const moment = require("moment");

const productsColection = getCollection("products");

const ordersColection = getCollection("orders");

router.get("/", doAuthToken, async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const datas = await ordersColection.find({ cashierID: _id });
    res.status(200).json(doFormat(200, "Success Fetch All Order", datas));
  } catch (error) {
    next(error);
  }
});

router.get("/:idOrder", doAuthToken, async (req, res, next) => {
  const { _id } = req.payload;
  const { idOrder } = req.params;
  try {
    const datas = await ordersColection.findOne({
      _id: idOrder,
      cashierID: _id,
    });
    res.status(200).json(doFormat(200, "Success Fetch All Order", datas));
  } catch (error) {
    next(error);
  }
});

router.post("/", doAuthToken, async (req, res, next) => {
  //note products is json array
  const { products, pay, total } = req.body;
  const { _id } = req.payload;
  try {
    const OBody = {
      products,
      pay,
      total,
      cashierID: _id,
      orderDate: moment().format("MM-YYYY"),
      createdAt: dateNow(),
      updatedAt: dateNow(),
    };
    await ordersColection
      .insert(OBody)
      .then((datas) => {
        res.status(201).json(doFormat(201, "Success create order", datas));
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
