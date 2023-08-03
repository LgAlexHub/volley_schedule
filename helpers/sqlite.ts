import { DB } from "sqlite";
import { dirname, fromFileUrl, normalize, join} from "path";

export const rootPath = normalize(dirname(fromFileUrl(Deno.mainModule)));

export function initMySqlite(init=false) {
    const db = new DB(join(rootPath, '/database/database.db'));
    if (init){
      const sqlScript = Deno.readTextFileSync(join(rootPath,'/database/init.sql'));
      try {
        db.execute(sqlScript);
      } catch (error) {
        console.error(error)
      }
    }
    return db;
  }

export function connect(){
  return new DB(join(rootPath, '/database/database.db'))
}
