import express from 'express';
import path from 'path';
import render from './renderer.dev';

const app = express();

app.use('/public', express.static(path.resolve('./build/public')));
app.use('*', render);
app.use('*', (err, req, res, next) => {
  console.log(err);
  next(err);
});
app.listen(process.env.PORT || '3000');
