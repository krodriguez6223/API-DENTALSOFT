import { Router } from "express";

const router = Router()

import * as rolesCtrl from '../../controllers/Administration/roles.controller.js'//importa todos mis controladores de la ruta producto
import { verifyToken } from "../../middlewares/auth.jwt.js";

router.post('/',[verifyToken],rolesCtrl.createRoles)
router.get('/',[verifyToken], rolesCtrl.getRoles)
router.put('/:rolId',[verifyToken], rolesCtrl.updateRolesById)
router.get('/:rolId',[verifyToken], rolesCtrl.getRolesById)




export default router;