import sql from 'mysql2';

class Database {
  constructor({ host, user, password, database }){
    this.sql = sql;
    this.pool = this.sql.createPool({ host, user, password, database }).promise();
  }
}



export default Database;
