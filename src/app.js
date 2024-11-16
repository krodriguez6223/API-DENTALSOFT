import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


import { createRoles } from './libs/initialSetUp.js';

import consultaCedula from './routes/consultaCedula.routes.js'
import roles from './routes/Administration/roles.routes.js'
import usersRoute from './routes/Administration/user.routes.js'
import clientesRoute from './routes/cliente.routes.js'
import authRoute from './routes/Administration/auth.routes.js'
import detCatalogoRoute from './routes/Administration/catalogo.routes.js'
import catalogoRoute from './routes/Administration/catalogo.routes.js'
import modulosRoute from './routes/Administration/modulos.routes.js'
import permisosRoute from './routes/Administration//permisos.routes.js'


const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

createRoles();

app.get('/', (req, res) => {
    res.json({
        author: 'Kelvin Rodriguez',
        descripcion: 'API-DENTALSOFT'

    })
})
// ====Administracion ==
app.use('/roles',roles)
app.use('/users',usersRoute)
app.use('/clientes',clientesRoute)
app.use('/auth',authRoute)
app.use('/catalogo',catalogoRoute);
app.use('/detallecatalogo',detCatalogoRoute)
app.use('/cedula',consultaCedula)
app.use('/modulos', modulosRoute)
app.use('/permisos', permisosRoute)



export default app;