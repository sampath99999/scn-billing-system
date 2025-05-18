// app.ts
import express from 'express';
import dotenv from 'dotenv';
import errorHandler from '#middlewares/errorHandler.middleware.js';
import router from '#routes/v1/routes.js';

dotenv.config();

export default function createApp() {
    const app = express();
    const port = process.env.PORT ?? '3000';

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    app.use('/api/v1', router);

    // 404 handler for unmatched routes
    app.use((req, res, next) => {
        const error = new Error(`Not found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    });

    // Global error handler - must be last
    app.use(errorHandler);
    return app;
}
