import cors from 'cors';
import express from 'express';
import logger from 'morgan';
// import session from 'express-session';
// import bodyParser from 'body-parser';
// import swaggerUI from 'swagger-ui-express';
// import passportStrategy from './helpers/pasportStrategy';
// import authRouter from './routes/authRouter';
// import accountRouter from './routes/accountRouter';
// import brandRouter from './routes/brandRouter';
// import warehouseRouter from './routes/warehouseRouter';
// import productRouter from './routes/productRouter';
// import userRouter from './routes/userRouter';
// import { swaggerSpec, swaggerUiOptions } from './docs/apiDoc';
// import { SECRET } from './utils/const.env.js';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { translateText } from './controllers/translateText.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
// app.use(passportStrategy.initialize());
// app.use(passportStrategy.session());

const getTranslation = async (ws: any, message: any) => {
  console.log(message.transcript.text, message.sourceLanguage);

  const sourceLanguage = message.sourceLanguage === 'es-MX' ? 'es' : 'ru';
  const targetLanguage = sourceLanguage === 'es' ? 'ru' : 'es';

  const translation = await translateText(
    message.transcript.text,
    sourceLanguage,
    targetLanguage
  );

  const translatedMessage = {
    type: 'translation',
    transcriptionId: message.transcript.id,
    translation: translation,
  };

  wss.clients.forEach((client) => {
    // if (client === ws && client.readyState === ws.OPEN) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(translatedMessage));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Message received:', message.toString());
    const data = JSON.parse(message.toString());

    if (data.type === 'translationRequest') {
      getTranslation(ws, data);
    } else {
      // Broadcast to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    }
  });
});

app.get('/', async (_, res) => {
  const spanishToRussian = await translateText('Buenos dias', 'es', 'ru');
  console.log('Spanish to Russian:', spanishToRussian);

  // const russianToSpanish = await translateText('Привет', 'ru', 'es');
  // console.log('Russian to Spanish:', russianToSpanish);

  res.send('WebSocket signaling server is running.');
});

/**
 * Landing Page Static Routes
 */
app.use(express.static('src/public'));

/**
 * Auth Routes
 */
// app.use('/auth', authRouter);

/**
 * API Routes
 */
// app.use('/api/v1/account', accountRouter);
// app.use('/api/v1/brand', brandRouter);
// app.use('/api/v1/warehouse', warehouseRouter);
// app.use('/api/v1/product', productRouter);
// app.use('/api/v1/user', userRouter);

/**
 * Swagger Documentation
 */
// app.use(
//   '/api-docs',
//   swaggerUI.serve,
//   swaggerUI.setup(swaggerSpec, swaggerUiOptions)
// );

export default server;
