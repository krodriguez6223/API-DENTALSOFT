import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as submodulosCtrl from '../../controllers/Administration/submodulos.controller.js'
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";


const router = Router()

const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;

    router.post(path, [verifyToken, checkPermissions(name, id)], submodulosCtrl.createSubmodulos)
    router.get(path, [verifyToken, checkPermissions(name, id)], submodulosCtrl.getSubmodulos)
    router.put(`${path}/:submoduloId`, [verifyToken, checkPermissions(name, id)], submodulosCtrl.updateSubmodulosById)
    router.get(`${path}/:submoduloId`, [verifyToken, checkPermissions(name, id)], submodulosCtrl.getSubmodulosById)

};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});



export default router;