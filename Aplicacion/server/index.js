import express from "express";
const PORT = process.env.PORT || 3001;
const app = express();

//Importo la interfaz con los metodos a utilizar
import interfaz from "./interfaz.js";

//En este archivo armo todos los enpoint que fueran necesarios
app.use("/getAlbumArtista", (req, res) => {
  const resultado = interfaz
    .solicitudListadoAlbum(req.socket.remoteAddress, req.query.artista)
    .then((respuesta) => {
      res.json(respuesta);
    });
});


app.listen(PORT, () => {
  console.log(`Corriendo el servidor en http://localhost:${PORT}`);
});
