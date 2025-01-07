import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

export class TestContainer {
  mysql: StartedMySqlContainer;

  async start(dbName: string, dbUser: string, dbPassword: string) {
    const mysql = await new MySqlContainer('mysql:8')
      .withDatabase(dbName)
      .withUser(dbUser)
      .withRootPassword(dbPassword)
      .start();
    this.mysql = mysql;
  }

  getConnectionString() {
    return `mysql://root:pw@${this.mysql.getHost()}:${this.mysql.getPort()}/${this.mysql.getDatabase()}`;
  }
}
