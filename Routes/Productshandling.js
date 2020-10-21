const router = require('express').Router();
const { doAuthToken } = require('../Helper/jwt');
const { getCollection } = require('../Db');
const { doFormat, dateNow } = require('../Helper/response');

const productsModels = getCollection('products');

const checkDatas = async (product) => {
  return await productsModels.findOne(product);
};

router.get('/', doAuthToken, async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const productsDatas = await productsModels.find({ owner: _id });
    res
      .status(200)
      .json(doFormat(200, 'Success fetch all products datas', productsDatas));
  } catch (error) {
    next(error);
  }
});

router.get('/:idProduct', doAuthToken, async (req, res, next) => {
  const { idProduct } = req.params;
  const { _id } = req.payload;
  try {
    const productsDatas = await productsModels.findOne({
      _id: idProduct,
      owner: _id
    });
    if (productsDatas) {
      res
        .status(200)
        .json(doFormat(200, 'Success fetch all products datas', productsDatas));
    } else {
      throw new Error('Products not found');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', doAuthToken, async (req, res, next) => {
  const { productName, price, description } = req.body;
  const { _id } = req.payload;
  const bodyA = {
    productName,
    description,
    price,
    owner: _id,
    createdAt: dateNow(),
    updatedAt: dateNow()
  };
  try {
    const check = await checkDatas({ productName, owner: _id });
    if (check) {
      throw new Error('Products was available in your catalog');
    } else {
      await productsModels
        .insert(bodyA)
        .then((datas) => {
          res
            .status(201)
            .json(doFormat(201, 'Success create new product catalog', datas));
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:idProduct/edit', doAuthToken, async (req, res, next) => {
  const { productName, price, description } = req.body;
  const { idProduct } = req.params;
  const { _id } = req.payload;
  const bodyA = {
    productName,
    description,
    price,
    updatedAt: dateNow
  };
  try {
    await productsModels
      .findOneAndUpdate({ _id: idProduct, owner: _id }, { $set: bodyA })
      .then((datas) => {
        res
          .status(200)
          .json(
            doFormat(
              200,
              `Success change ${datas.productName} product information`,
              datas
            )
          );
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
});

router.delete('/:idProduct/delete', doAuthToken, async (req, res, next) => {
  const { idProduct } = req.params;
  const { _id } = req.payload;
  try {
    await productsModels
      .findOneAndDelete({ _id: idProduct, owner: _id })
      .then(() => {
        res.status(200).json(doFormat(200, 'Success delete product', true));
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
