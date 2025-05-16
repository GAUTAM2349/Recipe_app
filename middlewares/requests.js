const logIncomingRequests = (req, res, next) => {
  console.log("\n\n a request came " + req.url + "\n");
  next();
};

module.exports = { logIncomingRequests };
