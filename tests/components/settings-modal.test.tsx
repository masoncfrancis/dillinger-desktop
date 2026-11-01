import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { useStore } from "@/stores/store";

describe("SettingsModal", () => {
  beforeEach(() => {
    useStore.setState({ settingsOpen: true });
  });

  it("shows editor settings without session or cloud settings", () => {
    render(<SettingsModal />);

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeVisible();
    expect(screen.getByText(/saved directly to disk/i)).toBeVisible();
    expect(screen.queryByText("Auto Save")).not.toBeInTheDocument();
    expect(screen.queryByText(/GitHub/i)).not.toBeInTheDocument();
  });

  it("updates editor preferences in memory", async () => {
    const user = userEvent.setup();
    render(<SettingsModal />);

    await user.selectOptions(screen.getByLabelText("Tab Size"), "2");
    expect(useStore.getState().settings.tabSize).toBe(2);
  });
});
