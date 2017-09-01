import express from 'express';
import path from 'path';
import serverRenderer from './serverRenderer';

const app = express();

app.use('/public', express.static(path.resolve('./build/public')));
app.use('*', serverRenderer);
app.use('*', (err, req, res, next) => {
  next(err);
});
app.listen(process.env.PORT || '3000');
