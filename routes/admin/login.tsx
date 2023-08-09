import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import {
  checkFormInputs,
  feedback,
  type FeedbackProps,
} from "../../helpers/form.tsx";
import { getCookies, setCookie } from "std/http/cookie.ts";

const formKeys = [
  { formKey: "id", formTranslation: "Identifiant" },
  { formKey: "pass", formTranslation: "Mot de passe" },
];

export const handler: Handlers = {
  GET(_, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const feedbackForm = checkFormInputs(formData, formKeys);
    if (feedbackForm.type === "success") {
      const header = new Headers(req.headers);
      const expire = new Date();
      expire.setDate(expire.getDate() + 1);
      setCookie(header, {
        name: "admin_checker",
        value: Deno.env.get("ADMIN_UUID") ?? "",
        sameSite: "Lax",
        domain: (new URL(req.url)).hostname,
        expires : expire,
        path: "/",
        secure: true,
      });
      header.set("location", "/admin/");
      return new Response(null, {
        status: 301,
        headers: header,
      });
    }
    return ctx.render(feedbackForm);
  },
};

export default function AdminLoginPage(
  feedbackProps: PageProps<FeedbackProps>,
) {
  return (
    <>
      <Head>
        <title>Les pieuvres Alizay - Admin</title>
      </Head>
      {feedback(feedbackProps)}
      <div class="bg-volley bg-no-repeat bg-center bg-cover	flex w-full h-screen">
        <div class="m-auto border-1 border-solid border-black rounded px-10 py-5 bg-white">
          <form method="POST" action="">
            <div class="grid grid-flow-row-dense grid-cols-1 grid-rows-2 gap-y-2 mb-1">
              <input
                class="border-b-1 border-solid border-black text-center"
                type="text"
                name="id"
                placeholder="Identifiant"
                id="id_input"
              />
              <input
                class="border-b-1 border-solid border-black text-center"
                type="password"
                name="pass"
                placeholder="Mot de passe"
                id="pass_input"
              />
            </div>
            <button class="rounded bg-blue-600 px-3 py-1 my-2 w-full text-white hover:bg-green-700">
              Connexion
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
