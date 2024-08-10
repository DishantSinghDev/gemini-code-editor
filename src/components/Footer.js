import React from "react";

const Footer = () => {
  return (
    <div className="fixed h-8 bottom-0 px-2 py-1 flex items-center justify-center w-full text-xs text-gray-500 ">
      <span>
        Built with{" "}
        
        by{" "}
        <a
          href="https://dishantsingh.me"
          target="__blank"
          className="text-gray-700  hover:bg-gray-300 duration-200 transition hover:text-white font-medium"
        >
          Dishant Singh
          
        </a>
        .{" "}Code at{" "}
        <a
          href="https://github.com/dishantsinghdev/gemini-code-editor"
          target="__blank"
          className="text-gray-700  hover:bg-gray-300 duration-200 transition hover:text-white font-medium"
        >
          GitHub
        </a>.{" "}
      </span>
    </div>
  );
};

export default Footer;
