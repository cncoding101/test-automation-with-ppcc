import { CustomWorld } from '@step-definitions/setup/world';
import { VARIANT_TEXT_TYPES } from '@utils/constants/dom';
import { VariantText } from '@utils/types/dom';
import { findElemByEvaluate } from '@support/element';
import { logger } from '@utils/helpers/logger';
import expect from 'expect';
import { Then } from '@cucumber/cucumber';

Then(
  /^I see the "([^"]*)" text "([^"]*)"$/,
  async function (this: CustomWorld, type: VariantText, text: string) {
    const {
      screen: { page },
    } = this;
    const variants = VARIANT_TEXT_TYPES[type];
    logger.log(`I see the ${type} text ${text}`);

    let exist = false;
    loop: for (let i = 0; i < variants.length; i++) {
      const { tagName } = variants[i];
      let elements = null;
      if (variants[i]?.className) {
        const { className, parent, findBy } = variants[i];
        // multiple
        if (className && parent && findBy) {
          exist = await findElemByEvaluate(page, parent, `${tagName}.${className}`, findBy, text);

          if (exist) break loop;
        }
        // elements = await page.$$(`${tagName}.${className}`);
      } else elements = await page.locator(`${tagName}:has-text("${text}")`); // most likely only one element

      if (elements) {
        if (Array.isArray(elements)) {
          await elements.forEach(async (x) => {
            const t = await x.innerText();

            logger.log(t);
          });

          exist = await elements.some(async (x) => {
            const t = await x.innerText();
            return t === text;
          });

          if (exist) break loop;
        } else {
          logger.log('single', elements);
          // only one element with the text thus we found it
          exist = true;
          break loop;
        }
      }
    }

    expect(exist).toBe(true);
  },
);
