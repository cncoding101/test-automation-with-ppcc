import { ILoginRecords } from '@/utils/interfaces';
import { authRecordsType } from '@/utils/types';

const sellers: ILoginRecords = {
  seller_1: {
    email: 'jg+testrail@onlinefuels.de',
    password: '21OLF%1510s',
  },
};

const buyers: ILoginRecords = {
  buyer_1: {
    email: '',
    password: '',
  },
};

const allRecords: authRecordsType = {
  sellers,
  buyers,
};

enum authTypes {
  sellers = 'sellers',
  buyers = 'buyers',
}

export default { sellers, buyers, allRecords, authTypes };
