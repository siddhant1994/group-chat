const request = require("supertest")("http://localhost:5000/api/v1");
const expect = require("chai").expect;
require("dotenv").config();
module.exports = {
  request,
  expect,
};
