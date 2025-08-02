import { Router } from 'express';
import { getAllPlaylists, createPlaylists, deletePlaylists, updatePlaylists } from '../controllers/playlistController.js';


const router = Router();

router.get('/', getAllPlaylists);
router.post('/', createPlaylists);
router.delete('/:id', deletePlaylists);
router.put('/:id', updatePlaylists);




export default router;
