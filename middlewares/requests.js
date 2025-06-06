let reqNo = 0;

const logIncomingRequests = (req, res, next) => {
  console.log("\n\n a request came " + req.url+ "  "+ req.method + "\n"+" req no: ",++reqNo + "\n",req.body);
  next();
};

module.exports = { logIncomingRequests };
