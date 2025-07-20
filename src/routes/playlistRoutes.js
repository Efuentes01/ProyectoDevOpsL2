import { Router } from 'express';
import { getAllPlaylists, createPlaylists, deletePlaylists } from '../controllers/playlistController.js';


const router = Router();

router.get('/', getAllPlaylists);
router.post('/', createPlaylists);
router.delete('/:id', deletePlaylists);



export default router;
