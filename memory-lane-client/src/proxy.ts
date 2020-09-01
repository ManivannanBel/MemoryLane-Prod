import { createProxyMiddleware } from 'http-proxy-middleware';
import express, {Application} from 'express';

const app : Application = express();

module.exports = (app : Application) => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true
        })
    )
    app.listen(3000);
}