import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "../components/LanguageSwitcher";

const mockPush = vi.fn();
const mockPathname = vi.fn(() => "/en/todos");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}));

const labels = { en: "English", es: "Español", fr: "Français", no: "Norsk" };

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPathname.mockReturnValue("/en/todos");
  });

  it("renders buttons for all four locales", () => {
    render(<LanguageSwitcher currentLang="en" labels={labels} />);
    expect(screen.getByRole("button", { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Español/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Français/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Norsk/ })).toBeInTheDocument();
  });

  it("disables the button for the current locale", () => {
    render(<LanguageSwitcher currentLang="en" labels={labels} />);
    expect(screen.getByRole("button", { name: /English/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Español/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Français/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Norsk/ })).not.toBeDisabled();
  });

  it("sets aria-current on the active locale button", () => {
    render(<LanguageSwitcher currentLang="fr" labels={labels} />);
    expect(screen.getByRole("button", { name: /Français/ })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: /English/ })).not.toHaveAttribute("aria-current");
  });

  it("navigates to the selected locale when a button is clicked", async () => {
    render(<LanguageSwitcher currentLang="en" labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: /Español/ }));
    expect(mockPush).toHaveBeenCalledWith("/es/todos");
  });

  it("replaces the locale segment in the pathname", async () => {
    mockPathname.mockReturnValue("/fr/page");
    render(<LanguageSwitcher currentLang="fr" labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: /English/ }));
    expect(mockPush).toHaveBeenCalledWith("/en/page");
  });

  it("navigates to Norwegian locale when Norsk button is clicked", async () => {
    render(<LanguageSwitcher currentLang="en" labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: /Norsk/ }));
    expect(mockPush).toHaveBeenCalledWith("/no/todos");
  });

  it("disables the Norwegian button when current locale is no", () => {
    render(<LanguageSwitcher currentLang="no" labels={labels} />);
    expect(screen.getByRole("button", { name: /Norsk/ })).toBeDisabled();
  });

  it("renders flag emojis in each button", () => {
    render(<LanguageSwitcher currentLang="en" labels={labels} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toContain("🇬🇧");
    expect(buttons[1].textContent).toContain("🇪🇸");
    expect(buttons[2].textContent).toContain("🇫🇷");
    expect(buttons[3].textContent).toContain("🇳🇴");
  });
});
