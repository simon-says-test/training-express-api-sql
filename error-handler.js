const winston = require("winston");
const { CustomException } = require("./errors");

const handler = (err, req, res, next) => {
  if (err instanceof CustomException) {
    let log = `Error ${err.code}: ${err.message}`;
    winston.error(log);
    return res.status(err.code).json({
      status: "error",
      message: err.message,
    });
  }

  winston.error(`${err.message}`);
  return res.status(500).json({
    status: "error",
    message: `Error: ${err.message}`,
  });
};

module.exports = { handler };
