import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Register } from "../models/Register.ts";
import { connect } from "../helpers/sqlite.ts";
import { checkFormInputs, feedback, type FeedbackProps } from "../helpers/form.tsx";

const formKeys = [
  { "formKey": "last_name", "formTranslation": "Nom" },
  { "formKey": "first_name", "formTranslation": "Prénom" },
  {
    "formKey": "will_be_present",
    "formTranslation": "Bouton à cocher 'présent'",
  },
];

export const handler: Handlers = {
  async POST(req, ctx) {
    const formData = await req.formData();
    const feedbackForm = checkFormInputs(formData, formKeys)

    if (feedbackForm.type === "success") {
      const register = new Register(
        formData.get(formKeys[1].formKey)?.toString(),
        formData.get(formKeys[0].formKey)?.toString(),
        formData.get(formKeys[2].formKey)?.toString() === "0" ? false : true,
        formData.get("next_monday")?.toString(),
      );
      register.insert(connect());
    }

    return ctx.render(feedbackForm);
  },
};



export default function Home(feedbackProps: PageProps<FeedbackProps>) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)
  const daysUntilNextMonday = (8 - dayOfWeek) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  const nextMondayToLocalString = `${nextMonday.getDate()}/${
    nextMonday.getMonth() + 1
  }/${nextMonday.getFullYear()}`;

  return (
    <>
      <Head>
        <title>Les pieuvres Alizay</title>
      </Head>
      {feedback(feedbackProps)}
      <div class="bg-volley bg-no-repeat bg-center bg-cover	flex w-full h-screen">
        <div class="m-auto border-1 border-solid border-black rounded px-5 py-5 bg-white">
          <form method="POST" action="">
            <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-2 gap-y-2 mb-1">
              <input
                type="hidden"
                name="next_monday"
                value={nextMondayToLocalString}
              />
              <label class="col-span-1" htmlFor="">Nom</label>
              <input
                class="col-span-2 border-b-1 border-solid border-black text-center"
                type="text"
                name="last_name"
                placeholder="Jacques, Hugette..."
                id="last_name_input"
              />
              <label class="col-span-1" htmlFor="">Prenom</label>
              <input
                class="col-span-2 border-b-1 border-solid border-black text-center"
                type="text"
                name="first_name"
                placeholder="Dupont, Dupuis..."
                id="first_name_input"
              />
            </div>
            <hr class="my-4" />
            <div class="mb-3">
              <p class="text-center mb-2">
                Serez-vous présent le
                <strong>
                  {nextMondayToLocalString}
                </strong>
                ?
              </p>
              <div class="flex justify-center mb-2">
                <label class="mr-2" htmlFor="">Oui</label>
                <input
                  class="mr-2"
                  type="radio"
                  name="will_be_present"
                  id="wbp_input"
                  value={1}
                  checked
                />
                <label class="mr-2" htmlFor="">Non</label>
                <input
                  type="radio"
                  name="will_be_present"
                  id="wbp_input"
                  value={0}
                />
              </div>
            </div>
            <button class="rounded bg-green-600 px-3 py-1 w-full text-white hover:bg-green-700">
              Valider
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
