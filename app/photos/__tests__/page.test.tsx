import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PhotosPage from "../page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

import { useSearchParams } from "next/navigation";

describe("Photos Page", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === "pickerUri") return "https://photos.google.com/picker/123";
        if (key === "sessionId") return "session-123";
        return null;
      }),
    } as unknown as ReturnType<typeof useSearchParams>);
  });

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

  it("should have a link to open the picker in a new tab", () => {
    render(<PhotosPage />);
    const link = screen.getByRole("link", {
      name: /open google photos picker/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://photos.google.com/picker/123",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });
});
