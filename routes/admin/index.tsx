import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import MondayPicker from "../../islands/MondayPicker.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    if (getCookies(req.headers).admin_checker != Deno.env.get('ADMIN_UUID')){
      const header = new Headers();
      header.set('location', '/admin/login');
      return new Response(
        null, {
          headers : header,
          status : 301
        }
      );
    }
    return ctx.render();
  },
};

export default function AdminIndex() {
  return (
    <>
      <Head>
        <title>Admin - Tableau de bord</title>
      </Head>
      <div class="bg-volley bg-no-repeat bg-center bg-cover flex w-screen h-screen px-5 py-10">
        <div class="px-4 py-4 w-screen h-50 opacity-90 border-1 border-solid border-black rounded bg-white">
          <MondayPicker />
        </div>
      </div>
    </>
  );
}
