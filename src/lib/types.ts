export interface Author {
  name: string;
  date: string;
}

export interface Tag {
  name: string;
}

export interface Category {
  name: string;
}

export interface FrontMatter {
  title: string;
  categories: Category[];
  tags: Tag[];
}

export interface Entry {
  entryId: string;
  content: string;
  frontMatter: FrontMatter;
  created: Author;
  updated: Author;
}

export interface EntryEdge {
  node: Entry;
  cursor: string;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hadPreviousPage: boolean;
}

export interface EntryConnection {
  edges: EntryEdge[];
  pageInfo: PageInfo;
}

export interface GetEntriesResponse {
  getEntries: EntryConnection;
}

export interface GetEntryResponse {
  getEntry: Entry;
}
