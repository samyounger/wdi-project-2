module.exports = {
  port: process.env.PORT || 3000,
  db: {
    test: "mongodb://localhost/barpleeze-api-test",
    development: "mongodb://localhost/barpleeze-api-development",
    // production: process.env.MONGODB_URI || "mongodb://localhost/barpleeze-api-production"
    production: process.env.MONGODB_URI || "mongodb://heroku_4xghs6kc:7ae8c35ihf4oksf78c53gcf5d5@ds033086.mlab.com:33086/heroku_4xghs6kc"
  },
  secret: process.env.SECRET || "secret token password"
};
