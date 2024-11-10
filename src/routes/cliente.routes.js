import { Router } from "express";

const router = Router()
import * as clienteCtrl from '../controllers/cliente.controller.js'//importa todos mis controladores de la ruta 
import { verifyToken } from "../middlewares/auth.jwt.js";


router.post('/',[verifyToken], clienteCtrl.createCliente)
router.get('/',[verifyToken], clienteCtrl.getClintes)
router.get('/:clienteId',[verifyToken], clienteCtrl.getClienteById)
router.put('/:clienteId',[verifyToken], clienteCtrl.updateClienteById)
router.put('/estado/:clienteDeleteId',[verifyToken], clienteCtrl.deleteClienteById)



export default router;