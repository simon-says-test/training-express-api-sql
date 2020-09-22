const { Connection } = require('./connection');

describe('Connection works', () => {
  beforeEach(async () => {
    await Connection.connect();
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
});
