import { poolPromise, sql } from "../config/db.js";

export async function getAllPlaylists(req, res) {

  try {
    const pool = await poolPromise;
    const result = await pool
    .request().query('SELECT * FROM Playlists');
    res.json(result.recordset);
  }
  catch (err) {
    res.status(500).send(err.message);
  }

};


export async function createPlaylists(req, res) {

  try {

    const { name, description } = req.body;
    // Validar campos básicos
    if (!name) {
      return res.status(400).json({ error: "Name es requerido" });

    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('name', name)
      .input('description', description || null)
      .query(`
        INSERT INTO Playlists (name, description)
        VALUES (@name, @description);
        SELECT SCOPE_IDENTITY() AS id;
      `);



    // Crear nueva playlist
    const newPlaylist = {
      id: result.recordset[0].id, // ID incremental (temporal)
      name,
      description,
    };

    res.status(201).json({ message: 'Playlist creada', playlist: newPlaylist });
  } catch (err) {
    console.error('❌ Error al crear playlist:', err.message);
    res.status(500).json({ error: 'Error al crear la playlist' });
  }
}

export async function updatePlaylists(req, res) {

  const id = Number(req.params.id);
  const { name, description } = req.body;
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Name', sql.NVarChar(100), name ?? null)
      .input('Description', sql.NVarChar(255), description ?? null)
      .query(`
        UPDATE dbo.Playlists
        SET Name = COALESCE(@Name, Name),
            Description = COALESCE(@Description, Description)
        WHERE Id = @Id;

        SELECT @@ROWCOUNT AS affected;

        SELECT Id, Name, Description
        FROM dbo.Playlists WHERE Id = @Id;
      `);

    const affected = result.recordsets[0][0]?.affected ?? 0;
    if (affected === 0) return res.status(404).json({ error: 'Playlist no encontrada' });

    const updated = result.recordsets[1][0];
    return res.status(200).json(updated);
  } catch (e) {
    console.error('PATCH /playlists/:id', e);
    return res.status(500).json({ error: e.message });
  }
};


export async function deletePlaylists(req, res) {

  const  id  = Number(req.params.id);

  try {
    const result = await sql.query`
      DELETE FROM dbo.Playlists WHERE Id = ${id};
      SELECT @@ROWCOUNT AS affected;
    `;
    const affected = result.recordset?.[0]?.affected ?? 0;
    if (affected === 0) return res.status(404).json({ error: 'Playlist no encontrada' });
    // Tracks se borran solos por ON DELETE CASCADE
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }


}
