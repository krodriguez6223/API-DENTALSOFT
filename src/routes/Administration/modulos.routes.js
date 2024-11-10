import { Router } from "express";

const router = Router()

import * as modulosCtrl from '../../controllers/Administration/modulos.controllers.js'//importa todos mis controladores de la ruta producto
import { verifyToken } from "../../middlewares/auth.jwt.js";

router.post('/',[verifyToken],modulosCtrl.createModulos)
router.get('/',[verifyToken], modulosCtrl.getModulos)
router.put('/:moduloId',[verifyToken], modulosCtrl.updateModulosById)
router.get('/:moduloId',[verifyToken], modulosCtrl.getModulosById)




export default router;