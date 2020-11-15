const router = require('express').Router();
const { doAuthToken } = require('../Helper/jwt');
const { getCollection, listCollection } = require('../Db');
const { dateNow, doFormat } = require('../Helper/response');
const moment = require('moment');

const ordersColection = getCollection('orders');
const productsCollection = getCollection(listCollection.products);

let processNumber = ['Awaiting', 'Processed', 'Finished'];

// Order Status Route : Awaiting, processed, ready, delivered

router.get('/', doAuthToken, async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const datas = await ordersColection.find({ cashierID: _id });
    res.status(200).json(doFormat(200, 'Success Fetch All Order', datas));
  } catch (error) {
    next(error);
  }
});

router.get('/:idOrder', doAuthToken, async (req, res, next) => {
  const { _id } = req.payload;
  const { idOrder } = req.params;
  try {
    const datas = await ordersColection.findOne({
      _id: idOrder,
      cashierID: _id
    });
    res.status(200).json(doFormat(200, 'Success Fetch All Order', datas));
  } catch (error) {
    next(error);
  }
});
// order status [
// {
//   status : Awaiting, processed, ready and delivered
//   time : time,
// }]
//products : [
//   {
//     id_products : id,
//     quantity : q,
//   }
// ]
//create order status
// Order Status Route : Awaiting, processed, delivered
router.post('/', doAuthToken, async (req, res, next) => {
  //note products is json array
  const { products, pay, total } = req.body;
  const statusOrder = [
    {
      status: processNumber[0],
      time: dateNow()
    }
  ];
  const { _id } = req.payload;
  try {
    const OBody = {
      products,
      pay,
      total,
      statusHistory: statusOrder,
      statusSummary: processNumber[0],
      cashierID: _id,
      orderDate: moment().format('MM-YYYY'),
      createdAt: dateNow(),
      updatedAt: dateNow()
    };
    await ordersColection
      .insert(OBody)
      .then((datas) => {
        res.status(201).json(doFormat(201, 'Success create order', datas));
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
});
// List status
// 0 = Awaiting
// 1 = processed
// 2 = finished
router.post('/:orderID/:orderStatus', doAuthToken, async (req, res, next) => {
  let { orderID, orderStatus } = req.params;
  try {
    if (orderStatus > 2) {
      throw new Error('Not known orders id');
    }
    const filter = {
      _id: orderID
    };
    const ordersData = await ordersColection.findOne(filter);
    const arrOrders = Array.from(ordersData.statusHistory);
    arrOrders.map((ss) => {
      if (ss.status === processNumber[orderStatus]) {
        throw new Error(
          `You orders status already ${processNumber[orderStatus]}`
        );
      }
    });
    arrOrders.push({
      status: processNumber[orderStatus],
      time: dateNow()
    });
    const update = {
      $set: {
        statusHistory: arrOrders,
        statusSummary: processNumber[orderStatus]
      }
    };
    await ordersColection.findOneAndUpdate(filter, update).then((data) => {
      res.status(200).json(doFormat(200, `Success change order`, data));
    });
  } catch (error) {
    next(error);
  }
});
// Get orders by process number
router.get('/status/:orderStatus', doAuthToken, async (req, res, next) => {
  let { orderStatus } = req.params;
  try {
    if (orderStatus > 2 || orderStatus === null) {
      throw new Error('Not known orders id');
    }
    const filter = {
      statusSummary: processNumber[orderStatus]
    };
    await ordersColection.find(filter).then((data) => {
      res
        .status(200)
        .json(
          doFormat(
            200,
            `Success fetch all ${processNumber[orderStatus]} orders`,
            data
          )
        );
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
