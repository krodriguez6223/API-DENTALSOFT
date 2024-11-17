import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as rolesCtrl from '../../controllers/Administration/roles.controller.js'//importa todos mis controladores de la ruta producto
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";


const router = Router()

const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;
   
    router.post(path,[verifyToken, checkPermissions(name, id)],rolesCtrl.createRoles)
    router.get(path,[verifyToken, checkPermissions(name, id)], rolesCtrl.getRoles)
    router.put(`${path}/:rolId`,[verifyToken, checkPermissions(name, id)], rolesCtrl.updateRolesById)
    router.get(`${path}/:rolId`,[verifyToken, checkPermissions(name, id)], rolesCtrl.getRolesById)
};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});


export default router;