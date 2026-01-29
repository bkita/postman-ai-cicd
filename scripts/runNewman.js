import { execSync } from 'child_process';
import "dotenv/config";

const {
    POSTMAN_COLLECTION_EXPORT_PATH,
    POSTMAN_COLLECTION_NAME,
    POSTMAN_ENVIRONMENT_EXPORT_PATH,
    POSTMAN_ENVIRONMENT_NAME,
    REPORT_DIR,
} = process.env;

if (!POSTMAN_COLLECTION_EXPORT_PATH || !POSTMAN_COLLECTION_NAME) {
    console.error('❌ Missing env vars: POSTMAN_COLLECTION_EXPORT_PATH or POSTMAN_COLLECTION_NAME');
    process.exit(1);
}

const collectionPath = `${POSTMAN_COLLECTION_EXPORT_PATH}/${POSTMAN_COLLECTION_NAME}.postman_collection.json`;
const environmentPath = POSTMAN_ENVIRONMENT_EXPORT_PATH && POSTMAN_ENVIRONMENT_NAME
    ? `${POSTMAN_ENVIRONMENT_EXPORT_PATH}/${POSTMAN_ENVIRONMENT_NAME}.postman_environment.json`
    : null;
const reportPath = `${REPORT_DIR}/newman.html`;

console.log('▶ Running Newman with:');
console.log('  Collection:', collectionPath);
if (environmentPath) {
    console.log('  Environment:', environmentPath);
}
console.log('  Report:', reportPath);

const newmanCommand = [
    'newman run',
    collectionPath,
    environmentPath ? `-e ${environmentPath}` : '',
    '--reporters cli,htmlextra',
    `--reporter-htmlextra-export ${reportPath}`
].filter(Boolean).join(' ');

execSync(newmanCommand, { stdio: 'inherit' });
console.log('✅ Newman run completed');