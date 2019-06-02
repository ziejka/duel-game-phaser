import { Router } from 'express'
import * as proxy from 'http-proxy-middleware'

export function staticsDevRouter() {
    const router = Router()

    // All the assets are hosted by Webpack on localhost:8080 (Webpack-dev-server)
    router.use('/', proxy(
        {
            target: 'http://localhost:8080/'
        }))

    return router
}
