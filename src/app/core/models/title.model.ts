export interface Title {
  id: string;
  title: string;
  year?: number;
  imageUrl?: string;
  type?: 'movie' | 'series' | 'episode';
}
