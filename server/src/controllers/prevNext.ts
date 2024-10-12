import type { Core } from '@strapi/strapi';
import isNumber from 'lodash/isNumber';

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  async welcome(ctx) {
    const prevNextService = strapi.plugin("strapi5-prev-next-button").service("prevNext");

    try {
      ctx.body = await prevNextService.getWelcomeMessage();
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async items(ctx) {
    
    if(!ctx.params.uid || !isNumber(Number(ctx.params.id))) {
      ctx.throw(400, 'uid and id are required');
    }

    const prevNextService = strapi.plugin("strapi5-prev-next-button").service("prevNext");

    const prevNextItems = await prevNextService.getPrevNextItems(ctx.params.uid, ctx.params.id);
      ctx.type = 'application/json; charset=utf-8';
      ctx.send(prevNextItems);
  },
});
