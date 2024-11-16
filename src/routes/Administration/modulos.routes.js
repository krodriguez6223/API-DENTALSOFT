import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as modulosCtrl from '../../controllers/Administration/modulos.controllers.js'
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";


const router = Router()

const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;

    router.post(path, [verifyToken, checkPermissions(name, id)], modulosCtrl.createModulos)
    router.get(path, [verifyToken, checkPermissions(name, id)], modulosCtrl.getModulos)
    router.put(`${path}:moduloId`, [verifyToken, checkPermissions(name, id)], modulosCtrl.updateModulosById)
    router.get(`${path}:moduloId`, [verifyToken, checkPermissions(name, id)], modulosCtrl.getModulosById)

};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});



export default router;