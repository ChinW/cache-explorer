/** Global definitions for development **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module "*.png" {
  const value: any;
  export default value;
}

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare namespace CacheGrid {
  interface Column {
    headerName: string;
    field?: string;
    children?: Column[];
    filter: boolean;
  }
}
