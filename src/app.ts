import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app = express();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000"
    ],
    credentials: true,
  }),
);
app.use(cookieParser())

app.use("/api", router)

app.get('/', (req: Request, res: Response) => {
  res.send('Server Running!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
