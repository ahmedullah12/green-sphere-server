import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';

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

app.use("/api", router)

app.get('/', (req: Request, res: Response) => {
  res.send('Server Running!');
});

export default app;
