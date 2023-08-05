import { useSignal } from "@preact/signals";
import { Register } from "../models/Register.ts";
import { useEffect, useState } from "preact/hooks";

function rows(register: Register[]) {
  let altern = true;
  return (register.map((register) => {
    altern = !altern;
    return (
      <tr>
        <td class={`bg-gray-${altern ? 200 : 400} border border-slate-600`}>
          {register.lastName}
        </td>
        <td class={`bg-gray-${altern ? 200 : 400} border border-slate-600`}>
          {register.firstName}
        </td>
        <td class={`bg-${register.coming ? "green" : "red"}-${altern ? 200 : 400}`}>
          {register.coming ? "Oui" : "Non"}
        </td>
      </tr>
    );
  }));
}

const updateMonday = (nextOrLast: boolean, date: Date) => {
  const tempDate = date;
  tempDate.setDate(
    nextOrLast ? tempDate.getDate() + 1 : tempDate.getDate() - 1,
  );
  const dayOfWeek = tempDate.getDay(); // 0 (dimanche) à 6 (samedi)
  let daysUntilMonday = (8 - dayOfWeek) % 7;
  if (!nextOrLast) {
    daysUntilMonday -= 7;
  }

  const tempNextMonday = new Date(tempDate);
  tempNextMonday.setDate(tempDate.getDate() + daysUntilMonday);
  return tempNextMonday;
};

const paginator = (
  totalPage: number,
  currentPage: number,
  callBack: (arg0: number) => void,
) =>
  Array.from(Array(totalPage).keys()).map((number) => (
    <button
      class={`rounded bg-blue-${number + 1 == currentPage ? 600 : 400} text-center px-1 py-1 my-2 w-full text-${number + 1 == currentPage ? 'black':'white'} hover:bg-blue-700`}
      onClick={() => callBack(number + 1)}
    >
      {number + 1}
    </button>
  ));

export default function MondayPicker() {
  const initNextMOnday = updateMonday(true, new Date());
  const nextMonday = useSignal(initNextMOnday);
  const [registers, setRegisters] = useState([] as Register[]);
  const totalRegisters = useSignal(0);
  const totalPage = useSignal(1);
  const currentPage = useSignal(1);
  const fetchRegister = async (stringDate: string) => {
    const apiResponse = await fetch(
      `https://${new URL(window.location.href).host}/api/registers?date=${
        encodeURI(stringDate)
      }&page=${currentPage}`,
    );
    const json = await apiResponse.json();
    setRegisters(json.data);
    totalRegisters.value = json.totalRows;
    totalPage.value = json.totalPage;
  };

  const dateToLocalString = (): string => {
    return `${nextMonday.value.getDate()}/${
      nextMonday.value.getMonth() + 1
    }/${nextMonday.value.getFullYear()}`;
  };

  const handleMondayButtons = (nextOrLast: boolean) => {
    currentPage.value = 1;
    nextMonday.value = updateMonday(nextOrLast, nextMonday.value);
    fetchRegister(dateToLocalString());
  };

  const handlePaginationButtons = (page: number) => {
    currentPage.value = page;
    fetchRegister(dateToLocalString());
  };

  useEffect(() => {
    fetchRegister(dateToLocalString());
  }, []);

  return (
    <div>
      <div class="w-full flex flex-row gap-x-10 justify-center">
        <button
          onClick={() => handleMondayButtons(false)}
          class="basis-1/4 px-2 py-1 border-2 rounded border-purple-700 bg-purple-700 text-white hover:bg-purple-400 transition-colors"
        >
          Lundi précédent
        </button>
        <p class="basis-1/2 text-center align-baseline font-bold pt-1 text-xl">
          {dateToLocalString()}
        </p>
        <button
          onClick={() => handleMondayButtons(true)}
          class="basis-1/4 px-2 py-1 border-2 rounded border-yellow-700 bg-yellow-700 text-white hover:bg-yellow-400 transition-colors"
        >
          Lundi suivant
        </button>
      </div>
      <p class="text-xl text-blue-500">
        Nombre d'inscris : <strong>{totalRegisters.value}</strong>
      </p>
      <div class="flex justify-center mt-5">
        <table class="table-auto rounded border-separate text-center w-full">
          <thead>
            <tr>
              <td class="border border-slate-600 text-blue-600 bg-gray-200">
                Nom
              </td>
              <td class="border border-slate-600 text-blue-600 bg-gray-200">
                Prénom
              </td>
              <td class="border border-slate-600 text-blue-600 bg-gray-200">
                Présent
              </td>
            </tr>
          </thead>
          <tbody>
            {rows(registers)}
          </tbody>
        </table>
      </div>
      <div class="my-5 flex justify-center gap-x-2 mx-20">
        {paginator(totalPage.value, currentPage.value, handlePaginationButtons)}
      </div>
    </div>
  );
}
