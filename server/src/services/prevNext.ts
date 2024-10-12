import type { Core } from '@strapi/strapi';
import { transformEntry } from '../utils';

type Settings = {
  mainField: string;
  defaultSortBy: string;
  defaultSortOrder: string;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  getWelcomeMessage() {
    return {
      body: 'Welcome to Strapi 🚀'
    };
  },

  async getPrevNextItems(uid, id) {
    const { findConfiguration } = strapi.plugin('content-manager').service('content-types');
    const { settings }: Record<string, Settings> = await findConfiguration(strapi.contentType(uid));
    const { mainField, defaultSortBy, defaultSortOrder } = settings; //defaultSortBy is 'title' in case of an article

    const currentEntry = await strapi.documents(uid).findOne({
      documentId: id,
      fields: [defaultSortBy]
    });

    if (currentEntry) {
      const sortByValue = currentEntry[defaultSortBy];
      const fields = ['id', mainField];
      const isAsc = defaultSortOrder.toLowerCase() === 'asc';

      const [descLessThan, ascGreaterThan] = await Promise.all([
        strapi.documents(uid).findMany({
          fields,
          filters: { [defaultSortBy]: { $lt: sortByValue } },
          sort: { [defaultSortBy]: 'desc' } as any,
          limit: 1,
        }),
        strapi.documents(uid).findMany({
          fields,
          filters: { [defaultSortBy]: { $gt: sortByValue } },
          sort: { [defaultSortBy]: 'asc' } as any,
          limit: 1,
        }),
      ]);

      return {
        prev: transformEntry(isAsc ? descLessThan : ascGreaterThan, mainField),
        next: transformEntry(isAsc ? ascGreaterThan : descLessThan, mainField),
      };
    }
    return { prev: null, next: null }
  },
});
