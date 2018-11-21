import * as express from 'express'
import * as config from './config'
import { apiRouter } from './routes/api-router'
import { staticsDevRouter } from './routes/statics-dev-router'
import { staticsRouter } from './routes/statics-router'

const app = express()

app.use(apiRouter())
app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter())

app.listen(config.SERVER_PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`App listening on port ${config.SERVER_PORT}!`)
})
