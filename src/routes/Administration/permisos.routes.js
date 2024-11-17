import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as permisosCtrl from '../../controllers/Administration/permisos.controller.js'//importa todos mis controladores de la ruta producto
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";

const router = Router()


const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;
   
    router.post(path,[verifyToken, checkPermissions(name, id)],permisosCtrl.createPermisos)
    router.get(path,[verifyToken, checkPermissions(name, id)], permisosCtrl.getPermisos)
    router.put(`${path}/:permisoId`,[verifyToken, checkPermissions(name, id)], permisosCtrl.updatePermisosById)
    router.get(`${path}/:permisoId`,[verifyToken, checkPermissions(name, id)], permisosCtrl.getPermisosById)
};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});



export default router;