import { Router } from "express";
import routesConfig from '../../conf/routes.js';
import * as userCtrl from '../../controllers/Administration/user.controller.js'//importa todos mis controladores de la ruta 
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";

const router = Router()

const createRoutes = (moduleConfig) => {
    const { path, name, id } = moduleConfig;

    router.post(path,[verifyToken, checkPermissions(name, id)], userCtrl.createUser)
    router.get(path,[verifyToken, checkPermissions(name, id)], userCtrl.getUsers)
    router.get(`${path}:userId`,[verifyToken, checkPermissions(name, id)], userCtrl.getUserById)
    router.put(`${path}:userId`,[verifyToken, checkPermissions(name, id)], userCtrl.updateUserById)
    router.put(`${path}estado/:userDeleteId`,[verifyToken, checkPermissions(name, id)], userCtrl.deleteUserById)

    //creacion de caja
    router.post('/caja',[verifyToken, checkPermissions(name, id)],       userCtrl.createCaja)
    router.get('/caja/getAll',[verifyToken, checkPermissions(name, id)], userCtrl.getCajas)
    router.get('/caja/activas',[verifyToken, checkPermissions(name, id)], userCtrl.getCajasActivas)
    router.put('/caja/:cajaId',[verifyToken, checkPermissions(name, id)], userCtrl.updateCaja)  

};

Object.values(routesConfig).forEach(moduleConfig => {
    createRoutes(moduleConfig);
});



export default router;