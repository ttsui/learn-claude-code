import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("should render the welcome heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Welcome to Next.js");
  });

  it("should render the project description", () => {
    render(<Home />);
    const description = screen.getByText(
      /A TypeScript Next.js starter with Vitest and Tailwind CSS/i,
    );
    expect(description).toBeInTheDocument();
  });

  it("should render a Connect to Google Photos button", () => {
    render(<Home />);
    const button = screen.getByRole("link", {
      name: /connect to google photos/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/api/auth/google");
  });
});
