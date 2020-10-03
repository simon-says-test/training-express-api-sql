const winston = require('winston');
const { CustomException } = require('./errors');

// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  if (err instanceof CustomException) {
    const log = `Error ${err.code}: ${err.message} - ${err.metadata ? err.metadata : ''}`;
    winston.error(log);
    return res.status(err.code).json({
      status: 'error',
      message: err.message,
    });
  }

  winston.error(`${err.message}`);
  return res.status(500).json({
    status: 'error',
    message: `Error: ${err.message}`,
  });
};

module.exports = { handler };
