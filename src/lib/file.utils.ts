export function getMediaTypeLabel(type: string): string {
  if (type.startsWith("image/")) {
    return "Image";
  } else if (type.startsWith("video/")) {
    return "Video";
  } else if (type.startsWith("audio/")) {
    return "Audio";
  } else if (type === "application/pdf") {
    return "PDF";
  } else if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.endsWith(".xlsx") ||
    type.endsWith(".xls")
  ) {
    return "Spreadsheet";
  } else if (
    type.includes("presentation") ||
    type.includes("powerpoint") ||
    type.endsWith(".pptx") ||
    type.endsWith(".ppt")
  ) {
    return "Presentation";
  } else if (
    type.includes("document") ||
    type.includes("word") ||
    type.endsWith(".docx") ||
    type.endsWith(".doc")
  ) {
    return "Document";
  } else if (
    type.includes("code") ||
    type.endsWith(".js") ||
    type.endsWith(".html") ||
    type.endsWith(".css") ||
    type.endsWith(".py")
  ) {
    return "Code";
  } else if (
    type.includes("zip") ||
    type.includes("compressed") ||
    type.includes("archive")
  ) {
    return "Archive";
  } else {
    return "Other";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}
