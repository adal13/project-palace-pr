import { defineStore } from 'pinia';
import { credential, IduserIAM, IdUsuario, secretUserIAM, userResponsible } from '../types';
// import { IdUsuario } from '../types';
// import Cookies from 'js-cookie'
import Cookies from 'universal-cookie';
const cookies = new Cookies({ path: '/' });
export const usedataStore = defineStore({
    id: 'datos',
    state: () => ({
        // logeo de usuario 
        usuario: null,


        dataUsers: [] as IdUsuario[],
        // editar usuario, obtener solo el usuario a editar
        dataEditID: [] as IdUsuario[],


        // datos de usuario IAM    
        dataUsersIAM: [{
            UserId: '',
            UserName: '',
            CreateDate: '',
            Status: '',
            accessKeyId: '',
            secretAccess: '',
            dateExpiration: '',
        }],
        // datos de usuarios responsables 
        dataResponsible: [] as userResponsible[],
        dataCredential: [] as credential[],

        // creacion de usuarios IAM 
        creatUserIAM: [{ UserName: '' }],
        creatCrentRegIAM: [{ UserName: '' }],


        // editar usuario IAM, obtener solo el usuario a editar
        dataEditIAM: [] as IduserIAM[],
        dataSecretIAM: [] as secretUserIAM[],



        //  registrar credencial de usuario IAM 
        dataIAM: [{
            UserName: '',
            UserId: '',
            accessKeyId: '',
            secretAccess: '',
            dateExpiration: '',
        }],
        whitOutCred: [{
            UserId: '',
            UserName: ''
        }],
        datos: [],
        isLoggedIn: cookies.get('isLoggedIn') === 'true' || false,
        role: cookies.get('role') || '',
        id_user: cookies.get('id') || '',
        //    logeo de usuario 
        //    usuario: null,
        //    rol: null,
    }),
    actions: {

        reset() {
            this.$reset();
        },

        // almacenar dato del JSON 
        userJson(id: string, user: string, email: string, password: string, role: string) {
            this.dataUsers.push({
                id,
                user,
                email,
                password,
                role,
            })
        },
        // limpiar usuario
        clearUserIds() {
            this.dataUsers = []
        },
        clearUserIdIAM() {
            this.dataUsersIAM = []
        },
        clearUserIdDataIAM() {
            this.dataIAM = []
        },
        // guardar un dato 
        userGet(id: string, user: string, email: string, password: string, role: string) {
            this.dataUsers.push(
                {
                    id,
                    user,
                    email,
                    password,
                    role,
                })
        },
        // guardar datos editados de usuarios 
        userEdit(saveDataEdit: IdUsuario) {
            this.dataEditID.push(saveDataEdit)
        },
        // metodo para obtener los datos IAM de endpoint
        userIAM(UserId: string, UserName: string, accessKeyId: string, CreateDate: string, Status: string, secretAccess: string, dateExpiration: string,) {
            this.dataUsersIAM.push({
                UserId,
                UserName,
                accessKeyId,
                CreateDate,
                Status,
                secretAccess,
                dateExpiration,
            })
        },
        userSecretIA(iam_access_key: string, iam_user_name: string, secret_access_key: string, status: string) {
            this.dataSecretIAM.push({
                iam_access_key,
                iam_user_name,
                secret_access_key,
                status
            })
        },
        // guardar datos editados de usuarios IAM secret
        userEditIAM(saveDataEditIAM: IduserIAM) {
            this.dataEditIAM.push(saveDataEditIAM)
        },
        userSecretIAM(dataSecretIAM: secretUserIAM) {
            this.dataSecretIAM.push(dataSecretIAM)
        },
        // eliminar un acces_key 
        deleteAccessKey(iam_user_name: string, iam_access_key: string) {
            this.dataSecretIAM.push({
                iam_user_name,
                iam_access_key,
            })
        },
        // registrar usuario normal
        saveData(dataUsers: IdUsuario) {
            this.dataUsers.push(dataUsers)
        },
        // registrar usuario IAM
        saveDataIAMs({ inputEvent }: { inputEvent: any }) {
            this.creatUserIAM.push(inputEvent)
        },


        // registrar los usuarios IAM 
        registCredentialIAM(UserName: string, UserId: string, accessKeyId: string, secretAccess: string, dateExpiration: string) {
            this.dataIAM.push({
                UserId,
                UserName,
                accessKeyId,
                secretAccess,
                dateExpiration,

            })

        },

        userResponsible(data: userResponsible[]) {
            this.dataResponsible = data;
        },

        addCredentials(userId: number, newCredential: credential) {
            const user = this.dataResponsible.find(user => user.id === userId);
            if (user) {
                user.credential.push(newCredential);
            }
        },


        CreadwhitOutCredentialIAM(UserName: string, UserId: string) {
            this.whitOutCred.push({
                UserId,
                UserName,

            })

        },
        //   guardar datos de nuevas credenciales 
        saveDataIAM(UserName: string) {
            this.creatUserIAM.push({
                UserName,
            })

        },

        saveRegCredentialIAM(UserName: string) {
            this.creatCrentRegIAM.push({
                UserName,
            })
        },

        setUsuario(usuario: null) {
            this.usuario = usuario
        },


        setLoggedIn(role: string, id_user: number) {
            // this.isLoggedIn = isLoggedIn
            this.isLoggedIn = true;
            this.id_user = id_user.toString()
            if (role) {
                this.role = role;
                cookies.set('role', role);
            }
            cookies.set('id', id_user.toString())
            cookies.set('isLoggedIn', 'true');
        },

        logout() {
            this.isLoggedIn = false;
            this.role = ''
            this.id_user = ''
            cookies.remove('isLoggedIn');
            cookies.remove('role');
            cookies.remove('id');
        },

    },

})