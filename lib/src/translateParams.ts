import { type JSX } from "preact";

export type TranslateParam = string | number | JSX.Element;

export interface TranslateParams<T extends TranslateParam = string | number | JSX.Element> {
  [key: string]: T;
}
