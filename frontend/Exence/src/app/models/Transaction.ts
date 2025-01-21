export interface Transaction {
  id: number;
  title: string;
  date: string; // String to represent date in ISO format
  amount: number;
  type: string;
  categoryId: number;
}
