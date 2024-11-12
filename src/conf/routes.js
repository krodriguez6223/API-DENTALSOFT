// config/routes.js
const routesConfig = {
    catalogo: {
        path: 'catalogo',
        submodules: {
            detalleCatalogo: '/catalogo/detallecatalogo',
            otraRuta: '/catalogo/otraRuta',
        },
    },
    usuario: {
        path: '/usuario',
        submodules: {
            detalleUsuario: '/usuario/detalle',
        },
    },
    
};

export default routesConfig;
