const { request, expect } = require("./config");

describe("GET /group", function () {
  it("respond with valid HTTP status code and response body", async function () {
    const response = await request
      .get("/group")
      .set("Authorization", "Bearer " + process.env.TEST_JWT_TOKEN);
    expect(response.status).to.eql(200);
    expect(response.body.result).to.greaterThan(0);
    expect(response.body.groups).to.be.an("array");
  });
});

describe("GET /group/name", function () {
  it("respond with valid HTTP status code and response body", async function () {
    const response = await request
      .get("/group/" + process.env.TEST_GROUP_NAME)
      .set("Authorization", "Bearer " + process.env.TEST_JWT_TOKEN);
    expect(response.status).to.eql(200);
    expect(response.body.group.users).to.be.an("array");
    expect(response.body.group.createdBy).to.be.an("object");
  });
});
