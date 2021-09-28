//Importo los datos para la conexion
import conexion from "./dbconfig.js";
//Importo el paquete que vamos a usar
import db from "mssql";
const { connect, VarChar } = db;

//Aca voy a guardar todos los metodos que se utilizan para trabjar con la base de datos

//Metodo para almacenar los datos de una solicitud
const insertNuevaSolicitud = async (userIp, nombreArtista) => {
  //Me conecto a la db
  let db = await connect(conexion);
  try {
    //Hago el insert en la tabla Solicitud
    const resultado = await db
      .request()
      .input("userIp", VarChar, userIp)
      .input("nombreArtista", VarChar, nombreArtista)
      .query(
        "insert into Solicitud (IpUser, Fecha, NombreArtista) values (@userIp, CONVERT(date, getdate()), @nombreArtista)"
      );
    if (resultado.rowsAffected < 1) {
        throw new Error('Error al insertar en la db');
    }else{
        return {fuciono: true}
    }
  } catch (error) {
      console.log(error);
      return {fuciono: false, mensajeError: error.Error}
  }
};

//Exporto el repositorio con los metodos disponibles
export default {
  insertNuevaSolicitud,
};
