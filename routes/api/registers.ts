import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { connect } from "../../helpers/sqlite.ts";
import { Register } from "../../models/Register.ts";
import { QueryParameterSet } from "sqlite";

const db = connect();

export const handler: Handlers = {
  GET(req, _) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    const api_key = getCookies(req.headers).admin_checker;
    if (api_key != Deno.env.get("ADMIN_UUID")) {
      return new Response(JSON.stringify("unauthorized"), {
        status: 401,
        headers: headers,
      });
    }

    const perPage = 10;
    const urlParams = new URLSearchParams(
      req.url.substring(req.url.indexOf("?")),
    );
    const page = urlParams.has("page") ? urlParams.get("page") : 1 ;
    const offset = (Number(page) - 1) * 10;
    const countRegister = Register.count({
      db: db,
      where: urlParams.has("date") ? "WHERE coming_date = ?" : null,
      value: urlParams.has("date") ? [urlParams.get("date")] : null,
    });
    const registers = Register.select({
      db: db,
      where: `${urlParams.has("date") ? "WHERE coming_date = ?" : ""} LIMIT ${offset}, ${perPage}`,
      value: urlParams.has("date")
      ? [urlParams.get("date")]
      : [] as QueryParameterSet,
    });
    const totalPage = Math.ceil(countRegister/perPage);
    const jsonResponse = {
      data : registers,
      totalPage : totalPage,
      totalRows : countRegister,
      perPage : perPage,
      currentPage : page
    };
    return new Response(
      JSON.stringify(
        jsonResponse,
        null,
        2,
      ),
      {
        headers: headers,
      },
    );
  },
};
