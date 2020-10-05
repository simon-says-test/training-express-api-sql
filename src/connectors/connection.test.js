const { Connection } = require('./connection');

describe('Connection works', () => {
  let connection;
  beforeEach(async () => {
    connection = await Connection.connect();
  });
  test('The async promise errors work', async () => {
    await expect(Connection.run('DELETE FROM wrong', [])).rejects.toThrowError(
      'SQLITE_ERROR: no such table: wrong'
    );
    await expect(Connection.all('SELECT * FROM wrong', [])).rejects.toThrowError(
      'SQLITE_ERROR: no such table: wrong'
    );
    await expect(Connection.get('SELECT * FROM wrong', [])).rejects.toThrowError(
      'SQLITE_ERROR: no such table: wrong'
    );
  });
  test('The connection is always the same one', async () => {
    expect(await Connection.connect()).toEqual(connection);
  });
});
