const winston = require('winston');
const { app, connectToDataSources } = require('./src/app');

const port = 3002;
app.listen(port, async () => {
  await connectToDataSources();
  winston.info(`Example app listening at http://localhost:${port}`);
});
