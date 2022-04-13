import sql from 'mysql2';

class Database {
  constructor({ host, user, password, database }){
    this.sql = sql;
    this.pool = this.sql.createPool({ host, user, password, database }).promise();
    this.pool.execute("SELECT * FROM `global` WHERE `id` = 1").then(([rows]) => {
      console.log( rows.at(0) );
    });
  }
}



export default Database;
