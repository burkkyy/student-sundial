export function getFileIcon(mimeType: string): string {
  if (mimeType.includes("pdf")) return "mdi-file-pdf-box"
  if (mimeType.startsWith("image/")) return "mdi-file-image"
  if (mimeType.startsWith("video/")) return "mdi-file-video"
  if (mimeType.startsWith("audio/")) return "mdi-file-music"

  if (mimeType.includes("point")) return "mdi-file-powerpoint"
  if (mimeType.includes("sheet")) return "mdi-file-excel"
  if (mimeType.includes("csv")) return "mdi-file-delimited"
  if (mimeType.includes("word")) return "mdi-file-word"

  console.log("Icon Fallback:", mimeType)

  return "mdi-file-document"
}
