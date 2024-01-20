import { HTMLElementTagName } from '@utils/types/dom';

interface ITextVariant {
  [type: string]: {
    tagName: HTMLElementTagName;
    findBy?: keyof HTMLElement;
    className?: string;
    parent?: IQuerySelector;
  }[];
}

interface IQuerySelector {
  type: string;
  name: string;
}

export { ITextVariant, IQuerySelector };
