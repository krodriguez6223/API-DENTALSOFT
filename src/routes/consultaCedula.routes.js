import { Router } from "express";

const router = Router()
import * as consultaCedulaCtrl from '../controllers/consultaCedula.controller.js'//importa todos mis controladores de la ruta producto


router.post('/',consultaCedulaCtrl.consultaCedula)


export default router;