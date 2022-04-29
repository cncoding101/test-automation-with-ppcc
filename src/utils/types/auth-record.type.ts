import { ILoginRecords } from '@/utils/interfaces';

type authType = 'sellers' | 'buyers';

type authRecordsType = {
  [key in authType]: ILoginRecords;
};

export { authRecordsType, authType };
