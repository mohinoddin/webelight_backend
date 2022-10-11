const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided.");

  const parts = authHeader.split(" ");
  // console.log(parts);
  if (!parts.length === 2) return res.status(401).send("Token error.");

  // const [scheme, token] = parts;
  // if (!/^Bearer$/i.test(scheme))
  //   return res.status(401).send("Token malformatted.");

  jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Token invalid.");

    req.user = decoded.user;
    return next();
  });
};

module.exports = authenticate;
