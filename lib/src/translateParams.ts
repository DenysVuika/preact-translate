import { type JSX } from "preact";

export type TranslateParam = string | number | JSX.Element;

export interface TranslateParams<T extends TranslateParam = string | number> {
  [key: string]: T;
}
