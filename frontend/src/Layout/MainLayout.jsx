import { Navigate } from "react-router";
import Navbar from "../Component/Navbar/Navbar";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { Button, Field, Input, Label, Textarea } from "@headlessui/react";
import TodoSection from "../Component/TodoSection/TodoSection";
import InProgress from "../Component/InProgress/InProgress";
import CompletedSection from "../Component/CompletedSection/CompletedSection";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function MainLayout() {
  const { user, loading } = useContext(AuthContext);
  // loading if user is loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-8 border-solid border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute  border-8 border-solid border-[#4186F4] border-t-transparent"></div>
        </div>
      </div>
    );
  }
  // navigate to login if user is not available
  if (!user?.displayName) {
    return <Navigate to="/login"></Navigate>;
  }
  // open modal
  const handleOpenModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
      document.body.classList.add("overflow-y-hidden");
    }
  };

  // close modal
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("overflow-y-hidden");
    }
  };
  // handle add task
  const handleAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.taskTitle.value;
    const description = form.taskDescription.value;
    const taskData = {
      title,
      description,
      Timestamp: new Date(),
      category: "to-do",
      order: Date.now(),
    };

    // sending data to db
    axios
      .post(`${import.meta.env.VITE_Server_url}/add-task`, taskData)
      .then((res) => {
        console.log(res.data);
        closeModal();
      });
  };

  return (
    <div>
      <Navbar />
      <section className="bg-[#f2f4f7] min-h-[calc(100vh-60px)]">
        <div className="w-9/12 mx-auto">
          <div className="flex justify-between items-center  pt-10">
            <h3 className="text-2xl font-semibold text-blue-950">My Tasks</h3>
            <div>
              <Button
                onClick={() => handleOpenModal("modelConfirm")}
                className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
              >
                Add tasks
              </Button>
            </div>
          </div>

          {/* main section */}
          <div className="grid grid-cols-3 gap-8 mt-8">
            {/* todo section */}
            <TodoSection />

            {/* inProgress section */}
            <InProgress />

            {/* completed section */}
            <CompletedSection />

            {/* modal */}

            <div
              id="modelConfirm"
              class="fixed hidden z-50 bg-black/50 inset-0 bg-opacity-60 overflow-y-auto h-full w-full px-4 "
            >
              <div class="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
                <div class="flex justify-end p-2">
                  {/* close button */}
                  <button
                    onClick={() => closeModal("modelConfirm")}
                    type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div class="p-6 pt-0">
                  <h4 className="text-lg font-bold mb-2 text-blue-950">
                    Enter Task details
                  </h4>
                  <form className="space-y-6 w-full" onSubmit={handleAddTask}>
                    {/* Task Title Field */}
                    <Field>
                      <Label className="text-sm font-medium text-gray-900">
                        Task Title
                      </Label>
                      <Input
                        name="taskTitle"
                        placeholder="Enter task title"
                        className="mt-2 block w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </Field>

                    {/* Task Description Field */}
                    <Field>
                      <Label className="text-sm font-medium text-gray-900">
                        Task Description
                      </Label>
                      <Textarea
                        name="taskDescription"
                        placeholder="Enter task description"
                        rows="4"
                        className="mt-2 block w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </Field>
                    <Button
                      type="submit"
                      className="text-white bg-[#4186F4] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
                    >
                      Yes, I'm sure
                    </Button>
                  </form>

                  {/* button */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

{
  /* <Outlet></Outlet> */
}
