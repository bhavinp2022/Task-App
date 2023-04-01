const jwt = require("jsonwebtoken");

function generateJWT(payload) {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "480h",
      });
      jwt.verify(token, process.env.JWT_SECRET, function (err, authData) {
        resolve({
          ...authData,
          token: token,
          sessionTime: authData.exp,
          payload: payload,
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  generateJWT,
  verifyJWT,
};
