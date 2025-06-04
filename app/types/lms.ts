export interface Lms {
  id: number;
  name: string;
  url: string;
}

export interface ExamData {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  private: boolean;
  authorName: string;
}
