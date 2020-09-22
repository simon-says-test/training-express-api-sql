const winston = require('winston');

// prettier-ignore
const logger = (req, res, next) => {
  const currentDatetime = new Date();
  const formattedDate = `${currentDatetime.getFullYear()
  }-${
    currentDatetime.getMonth() + 1
  }-${
    currentDatetime.getDate()
  } ${
    currentDatetime.getHours()
  }:${
    currentDatetime.getMinutes()
  }:${
    currentDatetime.getSeconds()
  }:${
    currentDatetime.getMilliseconds()}`;
  const { method } = req;
  const { url } = req;
  const status = res.statusCode;
  const log = `[${formattedDate}] ${method}:${url} ${status} ${JSON.stringify(
    req.body,
  )}`;
  winston.info(log);

  next();
};

module.exports = { logger };
