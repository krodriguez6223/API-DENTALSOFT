// config/routes.js
const routesConfig = {
    catalogo: {
        path: '/',
        name:'/catalogo',
        submodules: {
            detalleCatalogo: '/catalogo/detallecatalogo',
            otraRuta: '/catalogo/otraRuta',
        },
    },

    
};

export default routesConfig;
