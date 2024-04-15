export interface IdUsuario {
    id?: string,
    user?: string,
    email?: string,
    password?: string,
    role?: string,
};
export interface IduserIAM{
// interfaz reutilizable, acceskeyId es el unico que no se utiliza en visualizeCredIAM
    UserId?:string,
    UserName?:string,
    accessKeyId?:string, 
    CreateDate?:string,
    Status?:string,
    dateExpiration?: string,
    secretAcces?:string
};
export interface secretUserIAM {

    iam_user_name?: string,
    iam_access_key?: string,
    secret_access_key?: string,
    status?: string
};
export interface userWithOutCredential{
    UserId?:string | number,
    UserName?: string,
     expirationDate?:string,
    
};

export interface CredentRegistIAM{
    UserId?:string | number,
    UserName?:string,
    accessKeyId?:string,
    secretAccess?: string,
    dateExpiration?:string,
    
};
export interface CreatRegistIAM{
    UserId?:string | number,
    userName?:string,
    accessKeyId?:string,
    secretKey?: string,
    date?: string,
    ExpirationDate?: string,

};
export interface inicioSesion {
    user: string,
    password: string
}

export interface UserData {
    data: {
        userDTO: {
            id: number,
            role: string;
        };
    };
}

export interface userResponsible {
    data: {
        id:number,
        user: string,
        credential: 
        {
            id:number,
            iam_user_name: string,
            status: string,
            date_delete: string,
        }
    };
    
}