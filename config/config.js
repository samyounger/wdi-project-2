module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGOLAB_URI || "mongodb://localhost/barpleeze",
  secret: process.env.SECRET || "secret token password"
};
