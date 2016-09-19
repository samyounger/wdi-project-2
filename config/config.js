module.exports = {
  port: process.env.PORT || 3000,
  db: {
    test: "mongodb://localhost/barpleeze-api-test",
    development: "mongodb://localhost/barpleeze-api-development",
    production: process.env.MONGODB_URI || "mongodb://localhost/barpleeze-api-production"
  },
  secret: process.env.SECRET || "secret token password"
};
