import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify"

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

// Bersihkan HTML konten sebelum ditampilkan. Konten ditulis admin lewat editor,
// tetapi tetap disaring agar skrip atau atribut berbahaya tidak pernah dieksekusi.
export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "code", "pre", "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/(?!\/))/i,
  })
}
