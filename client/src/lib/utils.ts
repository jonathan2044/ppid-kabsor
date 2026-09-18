import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cuplikan teks polos dari konten berita; konten bisa berisi HTML (tag dibuang, entitas diterjemahkan)
export function getExcerpt(content: string, maxLength: number) {
  const doc = new DOMParser().parseFromString(content, "text/html")
  doc.querySelectorAll("script, style").forEach((el) => el.remove())
  const plain = (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
  if (plain.length <= maxLength) return plain
  return plain.substring(0, maxLength) + "..."
}
