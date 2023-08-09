import { Register } from "../models/Register.ts";

const apiKey = Deno.env.get('MONGO_DB_API_KEY') ?? '';
const baseURI = Deno.env.get('MONGO_DB_BASE_URL');

export async function insertOneRegister(register: Register) {
  const url = encodeURI(`${baseURI}/action/insertOne`);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      dataSource: "Cluster0",
      database: "volley-schedule",
      collection: "registers",
      document: register.toMap(),
    }),
  };
  const response = await fetch(url, options);
  return response;
}

export async function paginate(date: string, pageToGo: number, perPage = 5) {
  const url = encodeURI(`${baseURI}/action/find`);
  let response = null;
  perPage = perPage > 0 ? perPage : 1;
  pageToGo = pageToGo > 0 ? pageToGo : 1;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      dataSource: "Cluster0",
      database: "volley-schedule",
      collection: "registers",
      filter: {
        coming_date: date,
      },
      limit: perPage,
      skip: perPage * (pageToGo - 1),
    }),
  };

  try{
    response = await fetch(url, options);
    return await response.json();
  }catch(error){
    console.error(error)
  }
}

export async function countRegister(date: string): Promise<number> {
  const url = encodeURI(`${baseURI}/action/aggregate`);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      dataSource: "Cluster0",
      database: "volley-schedule",
      collection: "registers",
      pipeline: [
        { "$match": { "coming_date": date } },
        {
          "$group": {
            "_id": "$coming_date",
            "count": { "$sum": 1 },
          },
        },
      ],
    }),
  };
  const response = await fetch(url, options);
  const json = await response.json();
  return Number(json.documents[0]?.count ?? 0);
}
