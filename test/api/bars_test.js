require("../spec_helper");

const User = require("../../models/user");
const Bar = require("../../models/bar");

let TOKEN;
let bar;

describe("Bar tests", () => {

  beforeEach(done => {
    Bar.collection.drop();
    User.collection.drop();

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

  describe("GET /api/bars", () => {
    beforeEach(done => {
      bar = new Bar({
        name: "testBar",
        googlePlaceId: "uniqueBarId",
        url: "www.testbar.com",
        lat: 15,
        lng: 16
      });
      bar.save((err, bar) => {
        done();
      });
    });

    it("GET bars.index: should return a 200 response", done => {
      api.get("/api/bars")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${TOKEN}`)
        .expect(200, done);
    });

    // Complicated test. Requires access to the sub-array of the user object. Might also not be working because it needs access to googleMapsAPI to authenticate the key
    // it("Get bars/:id.data: should return a 200 response", done => {
    //   api.get(`/api/bar/${bar.id}`)
    //     .set("Accept", "application/json")
    //     .set("Authorization", `Bearer ${TOKEN}`)
    //     .expect(200, done);
    // });

    it("POST register: should return a 201 response", done => {
      api.get("/api/register")
        .set("Accept", "application/json")
        .expect(201, done);
    });
  });
});
