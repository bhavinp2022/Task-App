"use strict";

const Auth = require("../services/auth");

function getOrigin(event) {
  return event && event.headers && event.headers["Origin"] || event.headers["origin"] || "*";
}

module.exports.handler = async (event, ctx, cb) => {
  const {email, password} = JSON.parse(event.body);

  let {token, exp} = await Auth.generateJWT({
    email: email,
  });

  let cookieExpires = new Date(exp * 1000).toUTCString();
  // Create the cookie
  const cookie = `token=${token}; httpOnly=true; path=/; expires=${cookieExpires}; SameSite=None; Secure`;

  // Set the cookie in the response headers
  const response = {
    statusCode: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": getOrigin(event),
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({message: "Login successful", data: {email}}),
  };

  cb(null, response);
};