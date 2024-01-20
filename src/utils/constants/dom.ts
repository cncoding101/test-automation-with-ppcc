import { ITextVariant } from '@utils/interfaces/dom';

enum eFindTextByTypes {
  innerText = 'innerText',
}

const QUERY_SELECTOR_TYPES = {
  id: '#',
  class: '.',
} as const;

const VARIANT_TEXT_TYPES: ITextVariant = {
  error: [
    {
      tagName: 'span',
      className: 'error-message',
      parent: { type: QUERY_SELECTOR_TYPES.id, name: 'error-messages' },
      findBy: eFindTextByTypes.innerText,
    },
  ],
  title: [{ tagName: 'h1' }, { tagName: 'h2' }, { tagName: 'h3' }],
}; // not hard-coded

const HEADING = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export { VARIANT_TEXT_TYPES, QUERY_SELECTOR_TYPES, HEADING };
