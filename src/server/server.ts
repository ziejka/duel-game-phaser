import * as express from 'express'
import * as http from 'http'
import * as config from './config'
import { apiRouter } from './routes/api-router'
import { staticsDevRouter } from './routes/statics-dev-router'
import { staticsRouter } from './routes/statics-router'
import { createWebSocket } from './webSocket'

const app = express()
app.use(apiRouter())
app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter())

const server: http.Server = http.createServer(app)
createWebSocket(server)

server.listen(config.SERVER_PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening on port ${config.SERVER_PORT}!`)
})
