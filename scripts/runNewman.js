import { execSync } from 'child_process';
import "dotenv/config";

const {
    POSTMAN_COLLECTION_EXPORT_PATH,
    POSTMAN_COLLECTION_NAME,
    POSTMAN_ENVIRONMENT_EXPORT_PATH,
    POSTMAN_ENVIRONMENT_NAME,
    REPORT_DIR,
    RUNS
} = process.env;

if (!POSTMAN_COLLECTION_EXPORT_PATH || !POSTMAN_COLLECTION_NAME) {
    console.error('❌ Missing env vars: POSTMAN_COLLECTION_EXPORT_PATH or POSTMAN_COLLECTION_NAME');
    process.exit(1);
}

if (!REPORT_DIR) {
    console.error('❌ Missing env var: REPORT_DIR');
    process.exit(1);
}

const collectionPath = `${POSTMAN_COLLECTION_EXPORT_PATH}/${POSTMAN_COLLECTION_NAME}.postman_collection.json`;

const environmentPath = POSTMAN_ENVIRONMENT_EXPORT_PATH && POSTMAN_ENVIRONMENT_NAME
    ? `${POSTMAN_ENVIRONMENT_EXPORT_PATH}/${POSTMAN_ENVIRONMENT_NAME}.postman_environment.json`
    : null;

const totalRuns = RUNS ? Number(RUNS) : 1;

function getReportPath(runNumber) {
    if (totalRuns === 1) {
        return `${REPORT_DIR}/newman.html`;
    }
    return `${REPORT_DIR}/newman-run-${runNumber}.html`;
}

function runNewmanOnce(runNumber) {
    const reportPath = getReportPath(runNumber);

    console.log(`\n🚀 RUN ${runNumber}/${totalRuns}`);
    console.log('▶ Running Newman with:');
    console.log('  Collection:', collectionPath);
    if (environmentPath) {
        console.log('  Environment:', environmentPath);
    }
    console.log('  Report:', reportPath);

    const newmanCommand = [
        'newman run',
        `"${collectionPath}"`,
        environmentPath ? `-e "${environmentPath}"` : '',
        '--reporters cli,htmlextra',
        `--reporter-htmlextra-export "${reportPath}"`
    ].filter(Boolean).join(' ');

    execSync(newmanCommand, { stdio: 'inherit' });
    console.log(`✅ Run ${runNumber} completed`);
}

for (let i = 1; i <= totalRuns; i++) {
    runNewmanOnce(i);
}

console.log(`\n🎉 Finished ${totalRuns} Newman run(s)\n`);
