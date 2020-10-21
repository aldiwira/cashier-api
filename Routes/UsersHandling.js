const router = require("express").Router();
const { doFormat, dateNow } = require("../Helper/response");
const { getCollection } = require("../Db");
const { registerModel, loginModel } = require("../Helper/validator");
const { doSignToken } = require("../Helper/jwt");
const { decrypt, encrypt } = require("../Helper/encrypt");

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
        password: await encrypt(password),
        store_name,
        owner_name,
        lastLogin: dateNow(),
        createdAt: dateNow(),
        updatedAt: dateNow(),
      };
      const userReg = await usersModels.insert(body);
      const userToken = await doSignToken(userReg._id);
      res.status(201).json(
        doFormat(201, "Success register account", {
          user: userReg,
          token: userToken,
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    await loginModel().validate(req.body);
    await usersModels
      .findOneAndUpdate(
        {
          username: username,
        },
        {
          $set: {
            lastLogin: dateNow(),
            updatedAt: dateNow(),
          },
        }
      )
      .then(async (result) => {
        if (result) {
          if (await decrypt(password, result.password)) {
            const userToken = await doSignToken(result._id);
            res.status(200).json(
              doFormat(200, "Success login account", {
                user: result,
                token: userToken,
              })
            );
          } else {
            throw new Error("Wrong password account");
          }
        } else {
          throw new Error("Account not found");
        }
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
