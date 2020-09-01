const winston = require('winston');
const console = new winston.transports.Console({ level: 'debug' });
winston.add(console);

const logger = (req, res, next) => {
  let currentDatetime = new Date();
  let formatted_date =
    currentDatetime.getFullYear() +
    "-" +
    (currentDatetime.getMonth() + 1) +
    "-" +
    currentDatetime.getDate() +
    " " +
    currentDatetime.getHours() +
    ":" +
    currentDatetime.getMinutes() +
    ":" +
    currentDatetime.getSeconds() +
    ":" +
    currentDatetime.getMilliseconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let log = `[${formatted_date}] ${method}:${url} ${status} ${JSON.stringify(req.body)}`;
  winston.info(log);

  next();
};

module.exports = { logger };