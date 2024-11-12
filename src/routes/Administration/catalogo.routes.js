import { Router } from "express";

const router = Router()
import * as catalogoCtrl from '../../controllers/Administration/catalogo.controller.js' 
import { verifyToken } from "../../middlewares/auth.jwt.js";
import { checkPermissions } from "../../middlewares/permissions.js";

router.post('/',[verifyToken, checkPermissions('catalogo')], catalogoCtrl.createCatalogo)
router.get('/detalle',[verifyToken], catalogoCtrl.getDetCatalogo)
router.get('/',[verifyToken], catalogoCtrl.getCatalogo)
router.get('/:catalogoId',[verifyToken], catalogoCtrl.getCatalogoById)
router.put('/:catalogoId',[verifyToken], catalogoCtrl.updateCatalogoById)
router.post('/detalle',[verifyToken], catalogoCtrl.createDetCatalogo)
router.get('/detalle/:detallecatalogoId',[verifyToken], catalogoCtrl.getDetCatalogoById)
router.put('/detalle/:detallecatalogoId',[verifyToken], catalogoCtrl.updateDetCatalogoById)




export default router;