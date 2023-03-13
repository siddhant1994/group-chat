const { request, expect } = require("./config");

describe("POST /login", function () {
  it("respond with valid HTTP status code and description and message", async function () {
    const response = await request.post("/login").send({
      email: "siddhantsankhe02@gmail.com",
      password: "1234",
    });
    expect(response.status).to.eql(200);
  });
});
