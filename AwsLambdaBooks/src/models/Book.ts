export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;
  description: string;
  type: string;
  createdAt?: number;
  updatedAt?: number;
}
