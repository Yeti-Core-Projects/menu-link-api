const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MenuLink API',
            version: '1.0.0',
            description: 'API Documentation for MenuLink Restaurant Management System',
            contact: {
                name: 'MenuLink Support',
                email: 'support@menulink.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development Server',
            },
        ],
        components: {
            schemas: {
                Menu: {
                    type: 'object',
                    properties: {
                        categories: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Category'
                            }
                        },
                        totalDishes: {
                            type: 'integer',
                            description: 'Total number of dishes in the menu'
                        }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        nom: { type: 'string' },
                        ordre_affichage: { type: 'integer' },
                        dishes: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Dish'
                            }
                        }
                    }
                },
                Dish: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        nom: { type: 'string' },
                        description: { type: 'string' },
                        prix: { type: 'number' },
                        disponible: { type: 'boolean' },
                        image_url: { type: 'string' }
                    }
                },
                Session: {
                    type: 'object',
                    properties: {
                        session_id: { type: 'string' },
                        table_id: { type: 'string' },
                        started_at: { type: 'string', format: 'date-time' }
                    }
                }
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
