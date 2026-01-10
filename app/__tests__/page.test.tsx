import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("should render the welcome heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Google Photos Picker API Demo");
  });

  it("should render the Google Photos Picker demo component", () => {
    render(<Home />);
    const demoHeading = screen.getByText(/Google Photos Picker Demo/i);
    expect(demoHeading).toBeInTheDocument();
  });

  it("should render OAuth login button", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /Start OAuth Flow/i });
    expect(button).toBeInTheDocument();
  });
});
