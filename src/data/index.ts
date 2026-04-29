import { csharpData } from './csharp';
import { basicsData } from './basics';
import { aspnetData } from './aspnet';
import { webapiData } from './webapi';
import { databaseData } from './database';
import { frontendData, systemDesignData, devopsData } from './advanced';
import { codingTasks } from './codingTasks';
import { testingContent } from './testing';
import { performanceContent } from './performance';
import { securityContent } from './security';
import { loggingContent } from './logging';
import { patternsContent } from './patterns';
import { apiDocsContent } from './apidocs';

export const handbookData = [
  { id: 'basics', ...basicsData },
  { id: 'csharp', ...csharpData },
  { id: 'aspnet', ...aspnetData },
  { id: 'webapi', ...webapiData },
  { id: 'database', ...databaseData },
  { id: 'testing', ...testingContent },
  { id: 'performance', ...performanceContent },
  { id: 'security', ...securityContent },
  { id: 'logging', ...loggingContent },
  { id: 'patterns', ...patternsContent },
  { id: 'apidocs', ...apiDocsContent },
  { id: 'frontend', ...frontendData },
  { id: 'systemdesign', ...systemDesignData },
  { id: 'devops', ...devopsData },
  { id: 'tasks', ...codingTasks },
];

export { basicsData, csharpData, aspnetData, webapiData, databaseData, testingContent, performanceContent, securityContent, loggingContent, patternsContent, apiDocsContent, frontendData, systemDesignData, devopsData, codingTasks };
