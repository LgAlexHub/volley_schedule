import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  let resp = await ctx.next();
  const headers = new Headers();
  if (
    getCookies(req.headers)!.admin_checker ??
    "" != Deno.env.get("ADMIN_UUID")
    ) {
    headers.set("Content-Type", "application/json");
    resp = new Response(JSON.stringify("unauthorized"), {
      status: 401,
      headers: headers,
    });
  }

  return resp;
}
