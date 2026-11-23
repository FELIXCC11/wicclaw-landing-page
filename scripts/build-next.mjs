import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build'],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SITE_URL:process.env.NEXT_PUBLIC_SITE_URL||'https://wicclaw.it',WICCLAW_DEPLOYMENT_STAGE:process.env.WICCLAW_DEPLOYMENT_STAGE||'production'}});
process.exit(result.status??1);
