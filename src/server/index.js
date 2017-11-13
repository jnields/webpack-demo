import express from 'express';
import path from 'path';
import { config } from 'dotenv';
import serverRenderer from './serverRenderer';

const { PORT } = config().parsed;

const app = express();

app.use('/public', express.static(path.resolve('./build/public')));
app.use('/favicon.ico', (req, res) => { res.send(); });
app.use('*', serverRenderer);
app.use('*', (err, req, res, next) => {
  next(err);
});
app.listen(PORT || '3000');
