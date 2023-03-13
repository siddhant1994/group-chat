const { request, expect } = require("./config");

describe("GET /user", function () {
  it("respond with valid HTTP status code and response body", async function () {
    const response = await request
      .get("/user")
      .set("Authorization", "Bearer " + process.env.TEST_JWT_TOKEN);
    expect(response.status).to.eql(200);
    expect(response.body.result).to.greaterThan(0);
    expect(response.body.users).to.be.an("array");
  });
});
