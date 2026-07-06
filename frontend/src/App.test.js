import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders login screen", () => {
  render(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();
});
