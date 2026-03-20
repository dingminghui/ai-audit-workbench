import { useCallback, useState } from "react";

export interface UseSidebarStateReturn {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function useSidebarState(): UseSidebarStateReturn {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onToggleSidebar = useCallback(() => setIsSidebarOpen((v) => !v), []);

  return {
    isSidebarOpen,
    onToggleSidebar,
  };
}
