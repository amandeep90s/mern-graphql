import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  name: "",
  position: "",
  level: "",
};

const Record = () => {
  const [form, setForm] = useState(initialState);
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const id = params.id?.toString() ?? undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return false;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return false;
      }
      setForm(record);
    };
    fetchData();
  }, [params.id, navigate]);

  // These methods will update the state properties.
  const updateForm = (value) => {
    return setForm((prev) => ({ ...prev, ...value }));
  };

  // This function will handle the submission.
  const onSubmit = async (event) => {
    event.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm(initialState);
      navigate("/");
    }
  };

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="p-4 text-lg font-semibold">
        Create/Update Employee Record
      </h3>
      <form
        onSubmit={onSubmit}
        className="p-4 overflow-hidden border rounded-lg"
      >
        <div className="grid grid-cols-1 pb-12 border-b gap-x-8 gap-y-10 border-slate-900/10 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Developer Advocate"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="positionIntern"
                      name="positionOptions"
                      type="radio"
                      value="Intern"
                      className="w-4 h-4 cursor-pointer border-slate-300 text-slate-600 focus:ring-slate-600"
                      checked={form.level === "Intern"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionIntern"
                      className="block ml-3 mr-4 text-sm font-medium leading-6 text-slate-900"
                    >
                      Intern
                    </label>
                    <input
                      id="positionJunior"
                      name="positionOptions"
                      type="radio"
                      value="Junior"
                      className="w-4 h-4 cursor-pointer border-slate-300 text-slate-600 focus:ring-slate-600"
                      checked={form.level === "Junior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionJunior"
                      className="block ml-3 mr-4 text-sm font-medium leading-6 text-slate-900"
                    >
                      Junior
                    </label>
                    <input
                      id="positionSenior"
                      name="positionOptions"
                      type="radio"
                      value="Senior"
                      className="w-4 h-4 cursor-pointer border-slate-300 text-slate-600 focus:ring-slate-600"
                      checked={form.level === "Senior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionSenior"
                      className="block ml-3 mr-4 text-sm font-medium leading-6 text-slate-900"
                    >
                      Senior
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center px-3 mt-4 font-medium transition-colors border rounded-md cursor-pointer whitespace-nowrap text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9"
        />
      </form>
    </>
  );
};

export default Record;
