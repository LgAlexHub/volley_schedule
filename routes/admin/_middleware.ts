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
  const header = new Headers();
  const isAuthentified = getCookies(req.headers)!.admin_checker ??
    "" == Deno.env.get("ADMIN_UUID");
  const isLoginPage = req.url.includes("login");

  if (isLoginPage && isAuthentified) {
    header.set("location", "/admin/");
    resp = new Response(
      null,
      {
        headers: header,
        status: 301,
      },
    );
  }

  if (!isLoginPage && !isAuthentified) {
    header.set("location", "/admin/login");
    resp = new Response(
      null,
      {
        headers: header,
        status: 301,
      },
    );
  }

  return resp;
}
