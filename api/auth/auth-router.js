const router = require("express").Router();
const User = require("./users-model.js");
const {
  checkBody,
  checkUserNameExists,
  checkDuplicateUserName,
} = require("../config/middleware.js");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/secrets.js");

router.post(
  "/register",
  checkBody,
  checkDuplicateUserName,
  async (req, res) => {
    const credentials = req.body;
    try {
      const hash = bcryptjs.hashSync(credentials.password, 8);
      credentials.password = hash;
      const user = await User.register(credentials);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  }
);

router.post(
  "/login",
  checkBody,
  checkUserNameExists,
  async (req, res, next) => {
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
    let { username, password } = req.body;

    try {
      const user = await User.getUserBy({ username }).first();
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome ${user.username}`, token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    } catch (err) {
      next(err);
    }
  }
);

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  const secret = SECRET;
  return jwt.sign(payload, secret, options);
}

module.exports = router;
