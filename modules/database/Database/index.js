import sql from 'mysql2';

class Database {
  constructor({ host, user, password, database }){
    this.sql = sql;
    this.pool = this.sql.createPool({ host, user, password, database }).promise();

    this.launched = null;
  }


  get whenPool(){
    return new Promise(async (resolve, reject) => {
      const checkConnection = async () => await this.pool.query("select 1");
      try {
        await checkConnection();
        resolve(this);
      } catch (err) {
        if (err.message === "connect ECONNREFUSED ::1:3306"){
          resolve(undefined);
          return;
        }
        return reject(err);

      }
    });
  }
}



export default Database;
