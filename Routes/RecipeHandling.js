const router = require('express').Router();
const { doFormat, dateNow } = require('../Helper/response');
const { getCollection } = require('../Db');
const { doSignToken } = require('../Helper/jwt');

let recipeModels = getCollection('recipe');

// TODO
// Recipe Body
// {
//     _id : 21098120984021,
//     orderId: 1128473987,
//     userId : 12389289381,
//     createdAt, updatedAt
// }
// Get recipe by id
router.get('/', doSignToken, async (req, res, next) => {
  const { _id } = req.payload;
  try {
    await recipeModels.find({ userId: _id }).then((result) => {
      res.status(200).json(doFormat(200, 'Succes fetch recipe', result));
    });
  } catch (error) {
    next(error);
  }
});
// Create recipe
router.post('/create/:orderId', doSignToken, async (req, res, next) => {
  const { orderId } = req.params;
  const { _id } = req.payload;
  try {
    const available = await recipeModels.findOne({ orderId, userId: _id });
    if (!available) {
      await recipeModels
        .insert({
          orderId,
          userId: _id,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })
        .then((result) => {
          res
            .status(201)
            .json(doFormat(201, 'Success create recipe relation', result));
        });
    } else {
      throw new Error('Recipe was available');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
