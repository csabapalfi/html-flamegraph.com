import React from "react";

export default function Loading() {
  return (
    <>
      <div className="loading-message relative text-center w-full px-4 py-4">
        {"Generating your graph..."}
      </div>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}
