import { Router } from "express";

const router = Router()

import * as permisosCtrl from '../../controllers/Administration/permisos.controller.js'//importa todos mis controladores de la ruta producto
import { verifyToken } from "../../middlewares/auth.jwt.js";

router.post('/',[verifyToken],permisosCtrl.createPermisos)
router.get('/',[verifyToken], permisosCtrl.getPermisos)
router.put('/:permisoId',[verifyToken], permisosCtrl.updatePermisosById)
router.get('/:permisoId',[verifyToken], permisosCtrl.getPermisosById)




export default router;