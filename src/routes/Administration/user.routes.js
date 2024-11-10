import { Router } from "express";

const router = Router()
import * as userCtrl from '../../controllers/Administration/user.controller.js'//importa todos mis controladores de la ruta 
import { verifyToken } from "../../middlewares/auth.jwt.js";


router.post('/',[verifyToken], userCtrl.createUser)
router.get('/',[verifyToken], userCtrl.getUsers)
router.get('/:userId',[verifyToken], userCtrl.getUserById)
router.put('/:userId',[verifyToken], userCtrl.updateUserById)
router.put('/estado/:userDeleteId',[verifyToken], userCtrl.deleteUserById)

//creacion de caja
router.post('/caja',[verifyToken],       userCtrl.createCaja)
router.get('/caja/getAll',[verifyToken], userCtrl.getCajas)
router.get('/caja/activas',[verifyToken], userCtrl.getCajasActivas)
router.put('/caja/:cajaId',[verifyToken], userCtrl.updateCaja)  




export default router;