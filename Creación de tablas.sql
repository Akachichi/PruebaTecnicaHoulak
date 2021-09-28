create table Solicitud(
IdSolicitud int identity(1,1) primary key,
IpUser varchar(16) not null,
Fecha datetime not null,
NombreArtista varchar(50) not null
)