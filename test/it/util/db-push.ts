import { execSync } from 'node:child_process';

export const runPrismaDbPush = async () => {
  try {
    const deployOutput = execSync('npm run test:db-push').toString();
    console.log(deployOutput);
    console.log('Generate applied successfully.');
  } catch (error) {
    console.error('Error generating prisma:', error);
  }
};
