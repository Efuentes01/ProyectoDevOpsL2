import express, { json } from 'express';
import playlistRoutes from './routes/playlistRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎧 Servidor escuchando en puerto ${PORT}`);
});

app.use(json()); // Middleware para JSON

app.use('/api/playlists', playlistRoutes);
app.use('/api/createplaylist', playlistRoutes);
app.use('/api/deleteplaylist', playlistRoutes);


export default app;

