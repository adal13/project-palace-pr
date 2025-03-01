// Archivo que contiene los mensajes de error
export const errorMessages = {
     createUserIamError: "No se pudo crear el usuario IAM.",
     createUserError: "No se pudo crear el usuario.",
     generalError: "Ocurrió un error inesperado. Intente nuevamente.",


     successCreateIAM: "Usuario IAM creado con éxito.",
     credential: "Credenciales creada con éxito.",
     createErrCredential: "La credencial no fue creada con exito",

     addCredential: "Credencial agregada exitosamente",
     errorAddCredential: "La credencial no fue agregada con exito",
     exceededLimitCredential: "El usuario a excedido el limite de credenciales",

     deleteUser: "Usuario eliminado con exito",
     deleteErrorUser: "El usuario no fue eliminado",
     deleteUserError: "El usuario IAM no fue eliminado",

     createUser: "Usuario creado con exito",

     // /visualizeCredIAM
     create2Credential: "Se agrego correctamente la segunda credencial.",
     deleteCredential: "Se elimino correctamente la credencial",
     rotateCredential: "La llave fue rotada correctamente",
     activateCredential: "La llave se activo correctamente",
     desactivateCredential: "La llave se desactivo correctamente",

     // /visualizeCredIAM error
     create2CredentialErr: "La segunda credencial no se pudo agregar.",
     deleteCredentialErr: "La credencial no se pudo eliminar",
     rotateCredentialErr: "La llave no se pudo rotar",
     activateCredentialErr: "La llave no se puedo activar correctamente",

     // Login
     messageLoginError: "Error al Iniciar Sesión",
     messageAuthError: "Usuario y/o contraseña incorrecto",

     // 
     asignedUser: "Se ha asignado correctamente el usuario",
     asignedUserError: "No se ha asignado el usuario correctamente",

     validateInput: "Los datos del usuario no son válidos ",
} as const
