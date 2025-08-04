import {
  FileIcon as DummyFile,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FilePenLine,
  FileText,
  FileVideo,
} from "lucide-react";

interface FileIconProps {
  type: string;
  size?: number;
}

export function FileIcon({ type, size = 40 }: FileIconProps) {
  if (type.startsWith("image/")) {
    return <FileImage size={size} className="text-blue-500" />;
  } else if (type.startsWith("video/")) {
    return <FileVideo size={size} className="text-red-500" />;
  } else if (type.startsWith("audio/")) {
    return <FileAudio size={size} className="text-purple-500" />;
  } else if (type === "application/pdf") {
    return <FilePenLine size={size} className="text-red-600" />;
  } else if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.endsWith(".xlsx") ||
    type.endsWith(".xls")
  ) {
    return <FileText size={size} className="text-green-600" />;
  } else if (
    type.includes("presentation") ||
    type.includes("powerpoint") ||
    type.endsWith(".pptx") ||
    type.endsWith(".ppt")
  ) {
    return <FileText size={size} className="text-orange-500" />;
  } else if (
    type.includes("document") ||
    type.includes("word") ||
    type.endsWith(".docx") ||
    type.endsWith(".doc")
  ) {
    return <FileText size={size} className="text-blue-600" />;
  } else if (
    type.includes("code") ||
    type.endsWith(".js") ||
    type.endsWith(".html") ||
    type.endsWith(".css") ||
    type.endsWith(".py")
  ) {
    return <FileCode size={size} className="text-gray-600" />;
  } else if (
    type.includes("zip") ||
    type.includes("compressed") ||
    type.includes("archive")
  ) {
    return <FileArchive size={size} className="text-yellow-600" />;
  } else {
    return <DummyFile size={size} className="text-gray-500" />;
  }
}
