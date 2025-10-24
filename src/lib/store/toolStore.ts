import { create } from 'zustand';

interface ToolState {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
