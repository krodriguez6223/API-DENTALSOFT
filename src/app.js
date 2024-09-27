import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


import { createRoles } from './libs/initialSetUp.js';

import consultaCedula from './routes/consultaCedula.routes.js'
import roles from './routes/roles.routes.js'
import usersRoute from './routes/user.routes.js'
import authRoute from './routes/auth.routes.js'

const app = express()

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

createRoles();


app.get('/', (req, res) => {
    res.json({
        author: 'kelvin',
        descripcion: 'control-cnb'

    })
})
app.use('/roles',roles)
app.use('/users',usersRoute)
app.use('/auth',authRoute)
app.use('/cedula',consultaCedula)



export default app;