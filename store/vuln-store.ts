import { create } from "zustand";
import { VulnStore, WorkbookData } from "@/types/vulnerability";
import { calculateWorkbookStats, generateWorkbookId, extractWorkbookName } from "@/lib/risk-calculator";

/**
 * Store untuk mengelola vulnerability data di memory
 * Auto-cleanup setelah 1 jam default
 */
export const useVulnStore = create<VulnStore>((set, get) => ({
  workbooks: new Map(),
  uploadedAt: new Map(),
  autoCleanupInterval: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  cleanupTimer: undefined,

  /**
   * Tambahkan workbook baru ke store
   */
  addWorkbook: (workbook: WorkbookData) => {
    set((state) => {
      const newWorkbooks = new Map(state.workbooks);
      const newUploadedAt = new Map(state.uploadedAt);

      newWorkbooks.set(workbook.id, workbook);
      newUploadedAt.set(workbook.id, workbook.uploadedAt);

      return {
        workbooks: newWorkbooks,
        uploadedAt: newUploadedAt,
      };
    });
  },

  /**
   * Hapus workbook dari store
   */
  removeWorkbook: (id: string) => {
    set((state) => {
      const newWorkbooks = new Map(state.workbooks);
      const newUploadedAt = new Map(state.uploadedAt);

      newWorkbooks.delete(id);
      newUploadedAt.delete(id);

      return {
        workbooks: newWorkbooks,
        uploadedAt: newUploadedAt,
      };
    });
  },

  /**
   * Ambil workbook berdasarkan ID
   */
  getWorkbook: (id: string) => {
    return get().workbooks.get(id);
  },

  /**
   * Ambil semua workbooks sebagai array
   */
  getAllWorkbooks: () => {
    return Array.from(get().workbooks.values());
  },

  /**
   * Hapus semua workbooks
   */
  clearAllWorkbooks: () => {
    set({
      workbooks: new Map(),
      uploadedAt: new Map(),
    });
    get().stopAutoCleanup();
  },

  /**
   * Mulai auto-cleanup timer
   */
  startAutoCleanup: () => {
    const state = get();
    if (state.cleanupTimer) {
      clearInterval(state.cleanupTimer);
    }

    const timer = setInterval(() => {
      const expiredIds = get().checkExpiredWorkbooks();
      expiredIds.forEach((id) => {
        get().removeWorkbook(id);
      });
    }, 60000); // Check setiap 1 menit

    set({ cleanupTimer: timer });
  },

  /**
   * Hentikan auto-cleanup timer
   */
  stopAutoCleanup: () => {
    const state = get();
    if (state.cleanupTimer) {
      clearInterval(state.cleanupTimer);
      set({ cleanupTimer: undefined });
    }
  },

  /**
   * Cek workbook yang sudah expired
   */
  checkExpiredWorkbooks: () => {
    const state = get();
    const now = new Date();
    const expiredIds: string[] = [];

    state.uploadedAt.forEach((uploadedAt, id) => {
      const workbook = state.workbooks.get(id);
      if (workbook && workbook.expiresAt <= now) {
        expiredIds.push(id);
      }
    });

    return expiredIds;
  },
}));

/**
 * Helper function untuk membuat workbook dari vulnerabilities
 */
export function createWorkbook(
  vulnerabilities: any[],
  filename: string,
  autoCleanupInterval?: number
): WorkbookData {
  const id = generateWorkbookId();
  const name = extractWorkbookName(filename);
  const uploadedAt = new Date();
  const interval = autoCleanupInterval || 1 * 60 * 60 * 1000; // 1 hour default
  const expiresAt = new Date(uploadedAt.getTime() + interval);

  const stats = calculateWorkbookStats(vulnerabilities);

  return {
    id,
    name,
    uploadedAt,
    expiresAt,
    vulnerabilities,
    ...stats,
    averageRiskReduction: stats.averageRiskReduction,
  };
}

