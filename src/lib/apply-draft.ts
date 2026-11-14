/** Persist in-progress grant applications across refresh / failed submit. */

const STORAGE_KEY = "ifa-apply-draft-v1";
const IDB_NAME = "ifa-apply-draft";
const IDB_STORE = "files";
const IDB_VERSION = 1;

export type ApplyDraftFields = {
  version: 1;
  savedAt: string;
  step: number;
  personal: {
    name: string;
    dob: string;
    nationality: string;
    location: string;
    photoUrl?: string;
  };
  contact: { email: string; phone: string };
  identification: { nationalId: string; passport?: string };
  grant: {
    projectName: string;
    projectDescription: string;
    requestedAmount: number;
    fundUsage: string;
    expectedImpact: string;
  };
  background: { occupation: string; financialBackground: string };
  agreement: {
    certifyAccurate?: boolean;
    noGuarantee?: boolean;
    disqualification?: boolean;
  };
};

export type ApplyDraftFiles = {
  image?: File | null;
  nid_card?: File | null;
  proof_of_address?: File | null;
  business_plan?: File | null;
  projectGallery?: File[];
  supporting_documents?: File[];
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed"));
  });
  db.close();
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  const value = await new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed"));
  });
  db.close();
  return value;
}

async function idbClear(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB clear failed"));
  });
  db.close();
}

export function loadApplyDraftFields(): ApplyDraftFields | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApplyDraftFields;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveApplyDraftFields(draft: ApplyDraftFields): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Quota / private mode — ignore; fields still live in memory
  }
}

export async function saveApplyDraftFiles(files: ApplyDraftFiles): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await idbSet("image", files.image ?? null);
    await idbSet("nid_card", files.nid_card ?? null);
    await idbSet("proof_of_address", files.proof_of_address ?? null);
    await idbSet("business_plan", files.business_plan ?? null);
    await idbSet("projectGallery", files.projectGallery ?? []);
    await idbSet("supporting_documents", files.supporting_documents ?? []);
  } catch {
    // File persistence is best-effort
  }
}

export async function loadApplyDraftFiles(): Promise<ApplyDraftFiles> {
  if (typeof window === "undefined") return {};
  try {
    return {
      image: (await idbGet<File | null>("image")) ?? null,
      nid_card: (await idbGet<File | null>("nid_card")) ?? null,
      proof_of_address: (await idbGet<File | null>("proof_of_address")) ?? null,
      business_plan: (await idbGet<File | null>("business_plan")) ?? null,
      projectGallery: (await idbGet<File[]>("projectGallery")) ?? [],
      supporting_documents:
        (await idbGet<File[]>("supporting_documents")) ?? [],
    };
  } catch {
    return {};
  }
}

export async function clearApplyDraft(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  try {
    await idbClear();
  } catch {
    // ignore
  }
}

export function buildApplyDraftFields(input: {
  step: number;
  personal: ApplyDraftFields["personal"];
  contact: ApplyDraftFields["contact"];
  identification: ApplyDraftFields["identification"];
  grant: ApplyDraftFields["grant"];
  background: ApplyDraftFields["background"];
  agreement: ApplyDraftFields["agreement"];
}): ApplyDraftFields {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    step: input.step,
    personal: input.personal,
    contact: input.contact,
    identification: input.identification,
    grant: input.grant,
    background: input.background,
    agreement: input.agreement,
  };
}
