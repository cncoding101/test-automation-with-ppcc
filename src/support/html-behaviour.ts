import { ElementLocator } from '@utils/types/global';
import { ElementHandle, Page } from 'playwright';

const clickElement = async (page: Page, elementId: ElementLocator): Promise<void> => {
  await page.click(elementId);
};

const inputValue = async (page: Page, elementId: ElementLocator, input: string) => {
  await page.focus(elementId);
  await page.fill(elementId, input);
  await page.$eval(elementId, (el) => el.blur()); // defocus element
};

const selectValue = async (page: Page, option: string, elementId: ElementLocator) => {
  await page.focus(elementId);
  await page.selectOption(elementId, option);
};

const getElement = async (
  page: Page,
  elementId: ElementLocator,
): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
  const element = await page.$(elementId);
  return element;
};

const getElements = async (
  page: Page,
  elementId: ElementLocator,
): Promise<ElementHandle<SVGElement | HTMLElement>[]> => {
  const elements = await page.$$(elementId);
  return elements;
};

const getElementText = async (page: Page, elementId: ElementLocator): Promise<string | null> => {
  const text = await page.textContent(elementId);
  return text;
};

const checkElement = async (page: Page, elementId: ElementLocator): Promise<void> => {
  await page.check(elementId);
};

const uncheckElement = async (page: Page, elementId: ElementLocator): Promise<void> => {
  await page.uncheck(elementId);
};

const elementChecked = async (page: Page, elementId: ElementLocator): Promise<boolean | null> => {
  const checked = await page.isChecked(elementId);
  return checked;
};

const elementEnabled = async (page: Page, elementId: ElementLocator): Promise<boolean | null> => {
  const enabled = await page.isEnabled(elementId);
  return enabled;
};

const getValue = async (page: Page, elementId: ElementLocator): Promise<string | null> => {
  const value = await page.$eval<string, HTMLSelectElement>(elementId, (el) => {
    return el.value;
  });

  return value;
};

const scrollIntoView = async (page: Page, elementId: ElementLocator): Promise<void> => {
  const element = page.locator(elementId);
  await element.scrollIntoViewIfNeeded();
};

const getTableData = async (
  page: Page,
  skipCols: number[],
  skipRows: number[],
  elementId: ElementLocator,
): Promise<string> => {
  let table = await page.$$eval(`${elementId} tbody tr`, (rows) => {
    return rows.map((row) => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).map((cell) => cell.textContent);
    });
  });

  if (skipCols.length > 0)
    table.map((rows) => {
      for (let i = 0; i < skipCols.length; i++) {
        if (rows[skipCols[i] - 1]) rows[skipCols[i] - 1] = null;
      }

      return rows.filter((row) => row !== null);
    });

  if (skipRows.length > 0)
    for (let i = 0; i < skipRows.length; i++) {
      table.splice(skipRows[i] - 1, 1);
    }

  // remove spaces and new lines
  table = table.map((rows) => {
    return rows
      .map((row) => {
        if (!row) return '';
        return row
          .trim()
          .split(/\s+/)
          .map((word) => (/^[a-zA-Z]+$/.test(word) ? word : word.replace(/\s+/g, '')))
          .join(' ');
      })
      .filter((row: string) => row !== '');
  });

  return JSON.stringify(table);
};
export {
  getElement,
  getElements,
  getElementText,
  checkElement,
  uncheckElement,
  elementChecked,
  elementEnabled,
  clickElement,
  inputValue,
  selectValue,
  getValue,
  scrollIntoView,
  getTableData,
};
