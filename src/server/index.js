import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

app.use('/static', express.static(path.resolve('./public')));
app.set('view engine', 'html');
app.set('views', 'public');

app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/html');
  fs.createReadStream('./public/index.html').pipe(res);
});

app.listen(3000);
