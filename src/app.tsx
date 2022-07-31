import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <>Hello Craft Extension</>;
};

const initApp = () => {
  const container = document.getElementById("grace");
  console.log("container", container);
  const root = createRoot(container);
  console.log("root", root);
  root.render(<App />);
};

export default initApp;
