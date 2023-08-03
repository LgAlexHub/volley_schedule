import { Handlers, PageProps } from "$fresh/server.ts";

export interface FeedbackProps {
  type: string | null;
  feedback: string | null;
}

export function checkFormInputs(
  formData: FormData,
  formKeys: { formKey: string; formTranslation: string }[],
) : FeedbackProps {
  const feedbackForm = {
    feedback : "Informations envoyées avec succés",
    type : "success",
  } as FeedbackProps;
  formKeys.forEach((formInput) => {
    if (
      formData.get(formInput.formKey) == null ||
      formData.get(formInput.formKey) == ""
    ) {
      feedbackForm.feedback = formInput.formTranslation;
      feedbackForm.type = "warning";
    }
  });
  return feedbackForm;
}

export function feedback(props: PageProps<FeedbackProps>) {
  if (props.data?.feedback && props.data?.feedback !== null) {
    return (
      <div
        class={`bg-${
          props.data.type === "success" ? "green" : "red"
        }-100 absolute w-full z-[9] py-2 border-1 border-${
          props.data.type === "success" ? "green" : "red"
        }-200 text-center rounded`}
      >
        <p>
          {props.data.type === "success"
            ? props.data.feedback
            : `Le champ ${props.data.feedback} est vide, veuillez le remplir`}
        </p>
      </div>
    );
  }
}
