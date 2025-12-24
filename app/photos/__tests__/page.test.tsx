import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PhotosPage from "../page";

describe("Photos Page", () => {
  it("should render the page title", () => {
    render(<PhotosPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Google Photos Picker");
  });

  it("should display instructions to select photos", () => {
    render(<PhotosPage />);
    const instructions = screen.getByText(/select photos/i);
    expect(instructions).toBeInTheDocument();
  });

  it("should have a link back to home", () => {
    render(<PhotosPage />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
