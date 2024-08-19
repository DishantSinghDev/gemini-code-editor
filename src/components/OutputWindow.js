import React from "react";
import { decode } from "base-64";

const getOutput = (outputDetails) => {
  let statusId = outputDetails?.status?.id;

  if (statusId === 6) {
    // compilation error
    return (
      <pre className="px-2 py-1 font-normal text-xs text-red-500">
        {decode(outputDetails?.compile_output)}
      </pre>
    );
  } else if (statusId === 3) {
    return (
      <pre className="px-2 py-1 font-normal text-xs text-green-500">
        {decode(outputDetails.stdout) !== null
          ? `${decode(outputDetails.stdout)}`
          : null}
      </pre>
    );
  } else if (statusId === 5) {
    return (
      <pre className="px-2 py-1 font-normal text-xs text-red-500">
        {`Time Limit Exceeded`}
      </pre>
    );
  } else {
    return (
      <pre className="px-2 py-1 font-normal text-xs text-red-500">
        {decode(outputDetails?.stderr)}
      </pre>
    );
  }
};
const OutputWindow = ({ outputDetails }) => {
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {outputDetails ? <>{getOutput(outputDetails)}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
