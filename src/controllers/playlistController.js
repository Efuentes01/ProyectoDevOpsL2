let playlists = []


export function getAllPlaylists(req, res) {
  res.json(playlists);
};


export function createPlaylists(req, res) {
  const { name, description } = req.body;
    // Validar campos básicos
  if (!name || !description) {
    return res.status(400).json({ error: "Name y description son requeridos" });
  }
    // Crear nueva playlist
  const newPlaylist = {
    id: playlists.length + 1, // ID incremental (temporal)
    name,
    description,
    tracks: [] // sin canciones al inicio
  };

  // Guardar en array
  playlists.push(newPlaylist);

  // Responder con 201 Created
  res.status(201).json(newPlaylist);
};

export function deletePlaylists(req, res) {
  const id = parseInt(req.params.id);
  const index = playlists.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  // Eliminar la playlist
  playlists.splice(index, 1);

  res.json({ message: "Playlist eliminada 🗑️" });
};
