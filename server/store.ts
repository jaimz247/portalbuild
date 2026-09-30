import fs from "fs";
import path from "path";

export interface StoredSubmission {
  id: string;
  type: "preview_request" | "partner_referral" | "partner_signup";
  data: Record<string, any>;
  createdAt: string;
  status: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      // In-memory fallback if file system is read-only
    }
  }
}

let inMemoryStore: StoredSubmission[] = [];

// Seed or load existing submissions
function loadStore(): StoredSubmission[] {
  ensureDirectoryExists();
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      inMemoryStore = JSON.parse(content);
      return inMemoryStore;
    } catch (e) {
      console.warn("[Store] Could not read submissions.json, starting fresh memory store");
    }
  }
  return inMemoryStore;
}

function saveStore() {
  ensureDirectoryExists();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryStore, null, 2), "utf-8");
  } catch (e) {
    console.warn("[Store] File write skipped; maintained in memory.");
  }
}

// Initialize on module load
loadStore();

export function recordSubmission(
  type: "preview_request" | "partner_referral" | "partner_signup",
  data: Record<string, any>
): StoredSubmission {
  const item: StoredSubmission = {
    id: data.id || `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    data: { ...data },
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || "pending",
  };

  // Upsert or prepend
  const existingIdx = inMemoryStore.findIndex((s) => s.id === item.id);
  if (existingIdx >= 0) {
    inMemoryStore[existingIdx] = item;
  } else {
    inMemoryStore.unshift(item);
  }

  saveStore();
  return item;
}

export function getAllSubmissions(filterType?: string): StoredSubmission[] {
  loadStore();
  if (filterType && filterType !== "all") {
    return inMemoryStore.filter((s) => s.type === filterType);
  }
  return inMemoryStore;
}

export function updateSubmissionStatus(id: string, newStatus: string): boolean {
  loadStore();
  const item = inMemoryStore.find((s) => s.id === id);
  if (item) {
    item.status = newStatus;
    item.data.status = newStatus;
    saveStore();
    return true;
  }
  return false;
}
