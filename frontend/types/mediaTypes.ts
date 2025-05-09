import { FileData } from "@/components/teacher/ContentForm/FilePicker";



export type MediaType = "image" | "video";
export type MediaStatus = "draft" | "posted";

export interface MediaItem {
  id: string;
  type: MediaType;
  uri: string;
  name: string;
  tags: string[];
  status: MediaStatus;
  date: string;
}

export type MediaFormState = {
  id: string;
  file: FileData | null;
  tags: string[];
  status: MediaStatus;
  date: string;
};