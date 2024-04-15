import fs from 'fs';
import config from '../src/amplifyconfiguration.json';

// console.log(config.aws_cloud_logic_custom.name); // Accede al valor de apiUrl
// console.log("Configuracion de api json", config.aws_cloud_logic_custom[0].name); // Accede al valor de apiKey
// console.log("Configuracion de api json", config.aws_cloud_logic_custom[0].endpoint); // Accede al valor de apiKey



// Lee el archivo JSON
// const config = require('./config.json');

// Reemplaza las variables de entorno
// config.aws_cloud_logic_custom[0].region = process.env.AWS_PROJECT_REGION;
// config.aws_cloud_logic_custom[0].endpoint = process.env.ENDPOINT;
const endpoint = process.env.API_ENDPOINT;

if (endpoint !== undefined) {
     config.aws_cloud_logic_custom[0].endpoint = endpoint;
}


// Reemplaza las variables de entorno

// Escribe el resultado en otro archivo JSON
fs.writeFileSync('./config_processed.json', JSON.stringify(config));