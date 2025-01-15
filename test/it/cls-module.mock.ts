import { ClsModuleOptions } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

export const clsModuleMockOption: ClsModuleOptions = {
  plugins: [
    new ClsPluginTransactional({
      adapter: new TransactionalAdapterPrisma({
        prismaInjectionToken: PrismaService,
      }),
    }),
  ],
  global: true,
  middleware: { mount: true },
};
