import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes'

const app = express();
const port = process.env.PORT || 6300;

app.use(morgan('dev'))

/* routers */
app.use('/', routes)



const server = app.listen(port, () => {
  console.log(`Server is running ${port}`)
});

export { app, server };
