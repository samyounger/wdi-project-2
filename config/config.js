module.exports = {
  port: process.env.PORT || 3000,
  db: "mongodb://localhost/barpleeze",
  secret: process.env.SECRET || "secret token password"
};
