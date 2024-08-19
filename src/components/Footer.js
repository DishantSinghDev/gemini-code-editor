import React from "react";

const Footer = () => {
  return (
    <div className="fixed h-8 bottom-0 px-2 py-1 flex items-center justify-center w-full text-xs text-gray-500 ">
      <span>
        Built with{" "}
        <a href="https://gemini.google.com/app" target="__blank">
        <img width={40} className="inline mb-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" />{" "}
        </a>
        by{" "}
        <a
          href="https://dishantsingh.me"
          target="__blank"
          className="text-gray-700  hover:bg-gray-700 duration-200 transition hover:text-white font-medium"
        >
          Dishant Singh
          
        </a>
        .{" "}Code at{" "}
        <a
          href="https://github.com/dishantsinghdev/gemini-code-editor"
          target="__blank"
          className="text-gray-700  hover:bg-gray-700 duration-200 transition hover:text-white font-medium"
        >
          GitHub
        </a>.{" "}
      </span>
    </div>
  );
};

export default Footer;
