import { Handlers } from "$fresh/server.ts";
import { Register } from "../../../models/Register.ts";
import { countRegister, paginate } from "../../../helpers/mongodb.ts";

export const handler: Handlers = {
  async GET(req, _) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    const perPage = 10;
    const urlParams = new URLSearchParams(
      req.url.substring(req.url.indexOf("?")),
    );
    const page = urlParams.has("page") ? urlParams.get("page") : 1;
    const countRegisters = await countRegister(urlParams.get("date") ?? "");
    let registers = await paginate(
      urlParams.get("date") ?? "",
      Number(page),
      perPage,
    );
    registers = registers.documents.map((
      register: {
        first_name: string;
        last_name: string;
        coming: boolean;
        coming_date: string;
      },
    ) => Register.fromMap(register));
    const totalPage = Math.ceil(countRegisters / perPage);
    const jsonResponse = {
      data: registers,
      totalPage: totalPage,
      totalRows: countRegisters,
      perPage: perPage,
      currentPage: page,
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
