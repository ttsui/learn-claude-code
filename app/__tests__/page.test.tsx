import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Google Photos Picker Integration");
  });

  it("should render the project description", () => {
    render(<Home />);
    const description = screen.getByText(
      /A Next.js application demonstrating OAuth 2.0 authentication and Google Photos Picker API integration/i,
    );
    expect(description).toBeInTheDocument();
  });

  it("should have sign in with Google link", () => {
    render(<Home />);
    const signInLink = screen.getByRole("link", { name: /sign in with google/i });
    expect(signInLink).toHaveAttribute("href", "/api/auth/google");
  });

  it("should have go to photos link", () => {
    render(<Home />);
    const photosLink = screen.getByRole("link", { name: /go to photos/i });
    expect(photosLink).toHaveAttribute("href", "/photos");
  });
});
