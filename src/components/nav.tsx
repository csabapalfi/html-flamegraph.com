import React, { ChangeEventHandler, FormEventHandler } from "react";

export const Nav = ({
  html,
  onSubmit,
  onChange,
}: {
  html: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) => (
  <nav className="relative bg-teal lg:flex lg:items-stretch w-full py-2">
    <div className="flex flex-no-shrink items-stretch justify-between h-12">
      <h1 className="flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white no-underline flex items-center font-bold text-base sm:text-lg hover:bg-teal-dark">
        {"HTML FlameGraph"}
      </h1>
    </div>
    <form
      onSubmit={onSubmit}
      className="flex-grow flex-no-shrink relative mb-2 lg:mb-0 leading-normal text-white no-underline flex items-center h-12"
    >
      <input
        type="textarea"
        placeholder="Paste your HTML here"
        value={html}
        onChange={onChange}
        className="flex-grow py-2 px-2 my-1 ml-4 mr-2"
      />
      <button
        type="submit"
        className="py-2 px-4 ml-2 mr-4 hover:bg-teal-dark border text-white"
      >
        {"Do it!"}
      </button>
    </form>
    <div className="lg:flex lg:items-stretch lg:flex-no-shrink lg:flex-grow">
      <div className="lg:flex lg:items-stretch lg:justify-end ml-auto"> </div>
    </div>
  </nav>
);
