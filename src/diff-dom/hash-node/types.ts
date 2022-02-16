export interface HashNode {
  hash: string;
  value: string;
  children: HashNode[] | null;
}
