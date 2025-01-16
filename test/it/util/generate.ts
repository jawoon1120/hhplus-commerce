import { execSync } from 'node:child_process';

export const runPrismaGenerate = async () => {
  try {
    const deployOutput = execSync('npm run test:generate').toString();
    console.log(deployOutput);
    console.log('Generate applied successfully.');
  } catch (error) {
    console.error('Error generating prisma:', error);
  }
};
