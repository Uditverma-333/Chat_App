/**
 * message router
 */

const { factories } = require('@strapi/strapi');

export default factories.createCoreRouter('api::message.message');
