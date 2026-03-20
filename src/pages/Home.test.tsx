import { Home } from "@/pages/Home";
import { normalizeExpandedMarkdown } from "@/pages/home/homeUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("react-zoom-pan-pinch", () => ({
  TransformWrapper: ({ children }: { children: ReactNode | ((api: Record<string, () => void>) => ReactNode) }) =>
    typeof children === "function"
      ? children({
          centerView: vi.fn(),
          resetTransform: vi.fn(),
          setTransform: vi.fn(),
          zoomIn: vi.fn(),
          zoomOut: vi.fn(),
          zoomToElement: vi.fn(),
      })
      : children,
  TransformComponent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

class ResizeObserverMock {
  observe() {}

  disconnect() {}

  unobserve() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("normalizes compact markdown tables into renderable markdown", () => {
    const markdown =
      "| 时间 | 题目 | 讲者 ||------|------|------|| 19:00 - 19:05 | 主席致辞 | 王晓蕊 教授 |";

    expect(normalizeExpandedMarkdown(markdown)).toContain("|\n|------|------|------|");
    expect(normalizeExpandedMarkdown(markdown)).toContain("|\n| 19:00 - 19:05 | 主席致辞 | 王晓蕊 教授 |");
  });

  it("renders the workbench without exposing excel metadata", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "会议结算审核工作台" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "邀请函 缩略图" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "线下会签到表 缩略图" })).toBeInTheDocument();

    expect(screen.queryByText("Sheet1")).not.toBeInTheDocument();
    expect(screen.queryByText(/anchorCell/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/xl\/media/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/rowRange/i)).not.toBeInTheDocument();
  });

  it("switches materials, filters results, and renders markdown tables", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const invitationAuditButton = screen
      .getAllByRole("button")
      .find((button) =>
        within(button).queryByText("是否由邀请函及会议日程两部分组成"),
      );

    expect(invitationAuditButton).toBeDefined();
    await user.click(invitationAuditButton!);

    expect(screen.getByText("异常详情")).toBeInTheDocument();
    await user.hover(screen.getByRole("button", { name: "查看异常详情" }));
    expect(screen.getByRole("table")).toBeInTheDocument();

    await user.click(screen.getByRole("img", { name: "线下会签到表 缩略图" }).closest("button")!);
    await user.click(screen.getByRole("button", { name: "筛选：人工介入" }));

    expect(screen.getAllByText("签到表是否有会议名字及日期").length).toBeGreaterThan(0);
    expect(screen.queryByText("签到表是否有会议负责人签字及签字日期")).not.toBeInTheDocument();
  });

  it("immediately expands the manual review item after filtering to manual", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.click(screen.getByRole("img", { name: "线下会签到表 缩略图" }).closest("button")!);
    await user.click(screen.getByRole("button", { name: "筛选：人工介入" }));

    expect(screen.getByText("签到表是否有会议名字及日期")).toBeInTheDocument();
    expect(screen.getByText("需人工复核")).toBeInTheDocument();
    expect(screen.getByText("识别到会议名字，未识别到会议日期")).toBeInTheDocument();
  });

  it("persists anomaly decisions locally and locks them after selection", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const confirmButton = screen.getByRole("button", { name: "确认异常" });
    const cancelButton = screen.getByRole("button", { name: "取消异常" });

    expect(confirmButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();

    await user.click(confirmButton);

    expect(screen.queryByRole("button", { name: "确认异常" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "取消异常" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("ai-audit-workbench.audit-decisions")).toBe(
      JSON.stringify({
        "invitation-letter:5": "confirm",
      }),
    );
  });
});
