require("../spec_helper");

const User = require("../../models/user");
const Bar = require("../../models/bar");

describe("GET /api/login with token", () => {

  beforeEach(done => {
    const user = new User({
      username: "test",
      email: "test@test.com",
      password: "password",
      passwordConfirmation: "password",
    });
    user.save((err, user) => {
      api.post("/api/login")
        .set("Accept", "application/json")
        .send({
          email: "test@test.com",
          password: "password"
        }).end((err, res) => {
          TOKEN = res.body.token;
          done();
        });
    });
  });

  it("List bars: should return a 200 response", done => {
    api
      .get("/api/bars")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${TOKEN}`)

      .expect(200, done);
  });

  it("Create bar: should return a 200 response", done => {
    api
      .post("/users/:id/bars")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        bar: {
          name: "testBar",
          googlePlaceId: "testId",
          url: "www.testsite.com",
          lat: 15,
          lng: 15
        }
      }).expect(200, done);
  });


});
