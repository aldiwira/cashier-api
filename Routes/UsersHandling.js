const router = require("express").Router();
const { doFormat, dateNow } = require("../Helper/response");
const { getCollection } = require("../Helper/db");
const { registerModel } = require("../Helper/validator");
const { doSignToken } = require("../Helper/jwt");

let usersModels = getCollection("users");

router.post("/register", async (req, res, next) => {
  let { username, password, store_name, owner_name } = req.body;
  try {
    await registerModel().validate(req.body);
    const exsist = await usersModels.findOne({
      $or: [
        { username: username },
        { store_name: store_name },
        { owner_name: owner_name },
      ],
    });
    if (exsist) {
      throw new Error("Your registered account was availabe");
    } else {
      const body = {
        username,
        password,
        store_name,
        owner_name,
        lastLogin: dateNow(),
        lastLogout: dateNow(),
        createdAt: dateNow(),
        updatedAt: dateNow(),
      };
      const userReg = await usersModels.insert(body);
      const userToken = await doSignToken(userReg._id);
      res
        .status(201)
        .json(
          doFormat(200, "Success register account", {
            user: userReg,
            token: userToken,
          })
        );
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
