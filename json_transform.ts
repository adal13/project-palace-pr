import { config } from 'dotenv';
import * as fs from 'fs';

config();

const amplifyConfigFilePath = './src/amplifyconfiguration.json';

let amplifyConfigData: any = {}; // Se define como tipo any para evitar errores de tipo al acceder a las propiedades

try {
     amplifyConfigData = JSON.parse(fs.readFileSync(amplifyConfigFilePath, 'utf-8'));
} catch (error) {
     console.error('Error al leer el archivo amplifyconfiguration.json:', error);
     process.exit(1); // Salir del programa si hay un error al leer el archivo
}

if (!amplifyConfigData.aws_cloud_logic_custom || amplifyConfigData.aws_cloud_logic_custom.length === 0) {
     console.error('El archivo amplifyconfiguration.json no tiene la estructura esperada.');
     process.exit(1); // Salir del programa si la estructura no es la esperada
}

// Verificar si hay al menos un elemento en aws_cloud_logic_custom antes de intentar acceder al primero
if (amplifyConfigData.aws_cloud_logic_custom[0]) {
     amplifyConfigData.aws_cloud_logic_custom[0].endpoint = process.env.AMPLIFY_API_ENDPOINT || amplifyConfigData.aws_cloud_logic_custom[0].endpoint;
}

try {
     fs.writeFileSync(amplifyConfigFilePath, JSON.stringify(amplifyConfigData, null, 2), 'utf-8');
     console.log('Variables de entorno agregadas correctamente al archivo amplifyconfiguration.json.');
} catch (error) {
     console.error('Error al escribir en el archivo amplifyconfiguration.json:', error);
}
