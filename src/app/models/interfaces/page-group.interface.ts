export interface PageGroup{
    id: number;
    name: string;
    pages?: Page[]
  }
  
  export interface Page{
    id: number;
    order: number;
    path: string;
    name: string;
    fontSet?: string;
    fontIcon?: string;
    children:Page[];
  }
  