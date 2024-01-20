import { getCurrentPageId } from './navigation-behaviour';
import { ElementKey, ElementLocator } from '@utils/types/global';
import { IGlobalConfig } from '@utils/interfaces/global';
import { IQuerySelector } from '@utils/interfaces/dom';
import { Page } from 'playwright';

async function findElemByEvaluate(
  page: Page,
  parent: IQuerySelector,
  child: string,
  findBy: keyof HTMLElement,
  textToMatch: string,
): Promise<boolean> {
  const exist = await page.evaluate(
    (args: {
      parent: IQuerySelector;
      findBy: keyof HTMLElement;
      child: string;
      textToMatch: string;
    }) => {
      const { parent, findBy, child, textToMatch } = args;
      const parentElem: HTMLElement | null = document.querySelector(`${parent.type}${parent.name}`);
      if (!parentElem) return false;

      const children: NodeListOf<HTMLElement> = parentElem.querySelectorAll(child);
      if (!children || children.length === 0) return false;

      const temp = Array.from(children);
      if (temp.some((x) => x[findBy] === textToMatch)) return true;

      return false;
    },
    { parent, findBy, child, textToMatch },
  );

  return exist;
}

const getElementId = (
  page: Page,
  elementKey: ElementKey,
  globalConfig: IGlobalConfig,
): ElementLocator => {
  const { pageElementMappings } = globalConfig;

  const currentPage = getCurrentPageId(page, globalConfig);

  const elementId =
    pageElementMappings[currentPage]?.[elementKey] || pageElementMappings.common?.[elementKey];

  if (!elementId) {
    throw Error(`Unable to find the ${elementKey} mapping!`);
  }

  return elementId;
};

export { findElemByEvaluate, getElementId };
