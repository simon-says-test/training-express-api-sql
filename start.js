const { app, connectToDataSources } = require('./app');

const port = 3000;
app.listen(port, async () => {
  await connectToDataSources();
  console.log(`Example app listening at http://localhost:${port}`);
});