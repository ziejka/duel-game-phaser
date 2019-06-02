import * as express from 'express'
import { Router } from 'express'
import * as path from 'path'

export function staticsRouter() {
    const router = Router()
    const publicPath = path.join(__dirname, '..', '..', 'public')

    // All the assets are in "public" folder (Done by Webpack)
    router.use(express.static(publicPath))
    return router
}
