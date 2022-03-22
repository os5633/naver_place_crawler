import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/', (_, res) => {
  res.end('hello world');
});

app.listen(8000, async () => {
  console.log('start!');
});
