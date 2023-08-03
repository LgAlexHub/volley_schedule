import {DB, QueryParameterSet, Row} from "sqlite";

export class Register {
    firstName : string|null|undefined;
    lastName : string|null|undefined;
    coming : boolean|null|undefined;
    comingDate : string|null|undefined;

    constructor(firstName: string|null|undefined, lastName: string|null|undefined, coming: boolean|null|undefined, comingDate: string|null|undefined){
        this.firstName = firstName;
        this.lastName = lastName;
        this.coming = coming;
        this.comingDate = comingDate;
    }

    static select(params : {db : DB, where : string, value : QueryParameterSet} ) : Register[] {
        return params.db.query(`SELECT * FROM registers ${params.where}`, params.value).map((row: Row) => new Register(
            String(row.at(2)),
            String(row.at(1)),
            Boolean(row.at(3)),
            String(row.at(4))
        ));
    }

    static count(params : {db : DB, where? : string|null|undefined, value? : QueryParameterSet|null|undefined}) : number {
        return Number(params.db.query(`SELECT count(*) FROM registers ${params.where ?? ''}`, params.value ?? [])[0][0]);
    }
    
    insert(db:DB): void {
        db.query(`INSERT INTO registers (first_name, last_name, coming, coming_date) VALUES (?, ?, ?, ?) `, [
            this.firstName,
            this.lastName,
            this.coming, 
            this.comingDate
        ]);
    }
}