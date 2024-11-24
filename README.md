# iBlog

La plataforma permite a los usuarios crear, editar, eliminar y comentar publicaciones. Cada usuario puede subir imágenes y comentar en los posts de otros usuarios. Además, la plataforma incluye un sistema de rangos, la opción de agregar una foto de perfil y establecer un nombre de usuario personalizado. Cuenta con funcionalidades de registro, inicio de sesión y una modalidad de sesión como invitado, en la cual los usuarios solo pueden visualizar las publicaciones de otros usuarios registrados, sin la capacidad de comentar ni realizar publicaciones.

El proyecto fue desarrollado utilizando React, Vite y CSS para el diseño y la interfaz de usuario. La base de datos está gestionada con MySQL, y el sistema fue desplegado en la nube a través de AWS, empleando servicios como EC2, S3 buckets y RDS para garantizar la escalabilidad y el almacenamiento seguro de los datos.

## Funcionalidades

### **INICIO DE SESIÓN Y REGISTRO**
- Los usuarios pueden crear una cuenta a través del formulario de registro.
- La plataforma permite iniciar sesión utilizando las credenciales creadas durante el registro.
- Se envían correos de confirmación al correo electrónico del usuario para validar el registro.
- Los usuarios pueden iniciar sesión y registrarse utilizando su cuenta de Gmail.
![WhatsApp Image 2024-11-24 at 11 02 31 AM (2)](https://github.com/user-attachments/assets/aa9afa9f-8ef9-4a1b-8074-39f8e5dee344)


### **RECUPERACIÓN DE CONTRASEÑA**
- Los usuarios tienen la opción de recuperar su contraseña en caso de olvido, recibiendo un correo con instrucciones para restablecerla.

### **INICIO DE PERFIL DE USUARIO**
- Cada usuario tiene la opción de personalizar su perfil, incluyendo el nombre de usuario y una foto de perfil.
![WhatsApp Image 2024-11-24 at 11 02 30 AM](https://github.com/user-attachments/assets/94323e2c-e63a-4103-b38f-3870b76c06e6)

### **COMENTARIOS**
- Los usuarios pueden comentar en publicaciones de otros usuarios, con la opción de editar o eliminar sus propios comentarios.
![WhatsApp Image 2024-11-24 at 11 02 31 AM](https://github.com/user-attachments/assets/d8716571-aee8-445a-9e77-2dffb433bddf)

## Funcionalidad Responsive

- La plataforma está completamente optimizada para dispositivos móviles, garantizando una experiencia de usuario fluida tanto en smartphones como en tablets.
- El diseño se adapta automáticamente al tamaño de la pantalla, asegurando que los usuarios puedan interactuar con las publicaciones, comentar y gestionar su perfil sin problemas en cualquier dispositivo.
- El uso de tecnologías como CSS Flexbox y Grid permite un layout flexible que mejora la visualización de los contenidos y la navegación en pantallas pequeñas.
![77c61853-7060-4de7-b859-70f638ec4e50](https://github.com/user-attachments/assets/40a1d25d-a60e-4af0-99c2-16ae33834ea8)

### **GESTIÓN DE POSTS**
- Los usuarios pueden crear, editar y eliminar publicaciones propias.
- Las publicaciones pueden incluir imágenes y texto, y son visibles para otros usuarios registrados.
- Se pueden agregar etiquetas a los posts para identificar su contenido y facilitar su categorización.
- Los usuarios pueden filtrar los posts por categoría, lo que permite acceder fácilmente a los contenidos de interés.
![WhatsApp Image 2024-11-24 at 11 02 30 AM (1)](https://github.com/user-attachments/assets/ea25d228-950e-4a02-baf3-5b70c2dfa19d)

## Tecnologías y Despliegue

- **Frontend**: React, Vite, CSS
- **Backend**: MySQL
- **Despliegue en la nube**: AWS (EC2, S3 Buckets, RDS)
