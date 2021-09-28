import repo from "./repositoriodb.js";
import fetch from "node-fetch";

//Aca guardo el token para poder utilizar las api
//Esto es para asumir que el usuario acepta desde el frontend y cuando nos mandan la solicitud usemos el token que nos dan
//Para conseguir el token desde el navegador hay que ir a https://developer.spotify.com/console/get-search-item/
//y seleccionar OAuth Token y copiar el valor en la variable de abajo
const token =
  "BQA5vZLRi0hNdq82TAkPeQN5t_cukermz8BTeQa5sKpJ2jj9k82LY1ngYw7DeGb7YOvVEymgI8vAu2IYH7PcoE2eQEVj2WYA8hVe5_9No36M2T8BjZQTsdXy8OICMIw5nAs2T1stS5c";

//Metodo para formatear el string del nombre
const formateoNombre = (nombre) => {
  let nuevoString = nombre;
  nuevoString.replace(" ", "%20");
  return nuevoString;
};

//Metodo para conseguir el id de un artista
//Este metodo simula que me mandan desde el Frontend el id del artista
const getIdArtista = async (nombreArtista) => {
  //Cuando hago la url le digo que me traiga solo 1, es decir agarro el primero para conseguir el id
  const url =
    "https://api.spotify.com/v1/search?q=" +
    nombreArtista +
    "&type=artist&limit=1";
  const resultado = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const dato = await resultado.json();
  //Devuelvo el id del artista para poder buscar todos los album
  return dato.artists.items[0].id;
};

//Metodo para conseguir todos los id de los album de un artista dado
const getAllAlbumArtista = async (idArtista) => {
  const url = "https://api.spotify.com/v1/artists/" + idArtista + "/albums";
  const resultado = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Acept: "application/json",
    },
  });
  const datos = await resultado.json();
  //Armo un array para guardar todos los id que voy a devolver
  let arrayRet = [];
  datos.items.forEach((album) => {
    arrayRet.push(album.id);
  });
  //Devuelvo todos los id
  return arrayRet;
};

//Metodo para ir a buscar los datos necesarios para mostrar de cada album
//Espera un listado de id de album
const getDatosExtraAlbum = async (listadoIdAlbum) => {
  let urlAux = "https://api.spotify.com/v1/albums?ids=";
  listadoIdAlbum.forEach((id) => {
    let aux = id + "%2C";
    urlAux += aux;
  });
  //Elinimo los ultimos 3 caracteres ya que no son necesarios
  let url = urlAux.substring(0, urlAux.length - 3);
  const resultado = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Acept: "application/json",
    },
  });
  const datos = await resultado.json();
  //Armo un array en el que voy a guardar los datos relevantes del array de albums
  let arrayRet = [];
  //Recorro todos los album para guardar lo que me interesan en el arrayRet
  datos.albums.forEach((album) => {
    //Objeto auxiliar que guardo los datos del album
    let aux = {
      nombre: album.name,
      id: album.id,
      imagenes: album.images,
      popularidad: album.popularity,
    };
    arrayRet.push(aux);
  });
  return arrayRet;
};

//Metodo para ordenar los album segun su popularidad
const ordenarPorPopularidad = async (listadoAlbum) => {
  return listadoAlbum.sort(
    (albumA, albumB) => albumB.popularidad - albumA.popularidad
  );
};

//Metodo para devolver los album ordenados por popularidad
const albumPorPopularidad = async (nombreArtista) => {
  //Formateo el nombre para poder pasarlo bien
  let nomArtista = formateoNombre(nombreArtista);
  //Consigo el id del artista
  const idArtista = await getIdArtista(nomArtista);
  //Voy a buscar los id de todos los album del artista
  const allIdAlbumArtista = await getAllAlbumArtista(idArtista);
  //Voy a buscar los datos que me interesan de los album
  const datosAlbum = await getDatosExtraAlbum(allIdAlbumArtista);
  //Ordeno el array de album
  const listadoOrdenado = await ordenarPorPopularidad(datosAlbum);
  return listadoOrdenado;
};

//Metodo para guardar los datos de la solicitud
const guardarSolicitud = async (ip, artista) => {
  return repo.insertNuevaSolicitud(ip, artista);
};

//Metodo publico al cual van acceder mediante el endpoit creado en idex.js
const solicitudListadoAlbum = async (ip, artista) => {
  //Guardo los datos de la solicitud
  const guardado = await guardarSolicitud(ip, artista);
  if (!guardado.fuciono) {
    //Si exploto algo al insertar en la base la solicitud hago guardo el log
    console.log(guardado.mensajeError);
  }
  //Voy a buscar el listado ordenado para devolver
  const listado = await albumPorPopularidad(artista);
  return listado;
};

export default {
  solicitudListadoAlbum,
};
