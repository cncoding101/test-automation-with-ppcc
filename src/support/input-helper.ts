import { RULE_TYPES } from '@utils/constants/rule';
import { logger } from '@utils/helpers/logger';
import { IGlobalConfig } from '@utils/interfaces/global';
import moment from 'moment';
import 'moment/locale/de'; // NOTE switch this out whenever you are using another language except german
// TODO make it possible to have multi languages

const isTrigger = (input: string, trigger: string): boolean => {
  return !!(trigger && input.startsWith(trigger));
};

const getLookupVariable = (input: string, lookupTrigger: string, config: IGlobalConfig): string => {
  const { emailsConfig } = config;
  if (!emailsConfig) return input;

  const key = input.substring(lookupTrigger.length);
  const lookupValue = emailsConfig[key] ?? process.env[key];

  if (!lookupValue) {
    throw Error(`Could not get ${input} lookup trigger`);
  }

  return lookupValue;
};

const getRuleVariable = (input: string, ruleTrigger: string): string => {
  // rule type at index 0
  const regex = new RegExp(`\\${ruleTrigger}-(.*?)\\.\\$`);
  const match = input.match(regex);
  if (!match) return input;

  const variables = input.split('.$');
  variables.shift(); // remove key from variables list
  switch (match[1]) {
    case RULE_TYPES.date: {
      let date = new Date();
      // check for date types in the rule skipping the rule type on index 0
      if (variables.some((x) => x.startsWith('tomorrow-of-month'))) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(new Date().getDate() + 1);

        if (tomorrow.getMonth() === today.getMonth()) date = tomorrow;
      } else if (variables.some((x) => x.startsWith('add'))) {
        const key = variables.find((x) => x.startsWith('add'))?.substring('add-'.length);
        if (key) {
          const regex = /(\d+)([dmy])/;
          const match = key.match(regex);
          if (match) {
            const digit = match[1];
            const type = match[2];

            if (/same-month/.test(key) && type === 'd') {
              let today = moment();
              if (/tomorrow-same-month/.test(key)) today = moment().add(1, 'days');
              const future = moment(today).add(digit, 'days');
              if (today.month() === future.month()) date = future.toDate();
              else date = moment().endOf('month').toDate();
            }
          }
        }
      } else if (variables.some((x) => x.startsWith('end-of-month')))
        date = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      if (variables.some((x) => x.startsWith('format'))) {
        const format = variables.find((x) => x.startsWith('format'))?.substring('format-'.length);
        if (format) return moment(date).format(format);
      }

      return new Date(date).toISOString().substring(0, 10);
    }
  }

  return input;
};

export const parseInput = (input: string, config: IGlobalConfig): string => {
  const lookupTrigger = process.env.VAR_LOOKUP_TRIGGER ?? '$.';
  const ruleTrigger = '$rule';

  if (isTrigger(input, process.env.VAR_LOOKUP_TRIGGER ?? '$.'))
    return getLookupVariable(input, lookupTrigger, config);
  else if (isTrigger(input, ruleTrigger)) return getRuleVariable(input, ruleTrigger);

  return input;
};
