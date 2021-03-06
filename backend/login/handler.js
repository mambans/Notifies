"use strict";

const login = require("./login");

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);
    if (!username) throw { statusCode: 422, message: "Username is required" };
    if (!password) throw { statusCode: 422, message: "Password is required" };

    const result = await login({ username, password });

    return {
      statusCode: result.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
      body: JSON.stringify(result.data),
    };
  } catch (e) {
    return {
      statusCode: e.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
      body: JSON.stringify(e),
    };
  }
};
