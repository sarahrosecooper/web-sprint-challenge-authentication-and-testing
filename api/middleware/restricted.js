const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/secrets.js");

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.headers?.authorization?.split("")[1];
  if (token) {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "token invalid" });
      } else {
        req.decodedToken = decodedToken;

        // On valid token in the Authorization header, call next.

        next();
      }
    });

    // On missing token in the Authorization header,
    //   the response body should include a string exactly as follows: "token required".
  } else {
    res.status(401).json({ message: "token required" });
  }
};
