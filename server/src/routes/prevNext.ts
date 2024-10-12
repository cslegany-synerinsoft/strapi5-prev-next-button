export default {
    //type: admin: internal and can be accessible only by the admin part (front-end part) of the plugin
    //type: content-api: accessible from external classical rest api, need to set access in strapi's Users & Permissions plugin
    //call: http://localhost:1337/prev-next-button/welcome and you'll receive getWelcomeMessage()

    type: 'admin', //changed from content-api to admin
    routes: [
        {
            method: 'GET',
            path: '/welcome',
            handler: 'prevNext.welcome',
            config: { 
              policies: [],
              auth: false,
            }
        },
        {
          method: 'GET',
          path: '/prev-next/:uid/:id',
          handler: 'prevNext.items',
          config: {
            policies: [],
            auth: false,
          },
        },
    ]
}