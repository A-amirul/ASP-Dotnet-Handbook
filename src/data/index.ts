import { csharpData } from './csharp';
import { basicsData } from './basics';
import { aspnetData } from './aspnet';
import { webapiData } from './webapi';
import { databaseData } from './database';
import { frontendData, systemDesignData, devopsData } from './advanced';
import { codingTasks } from './codingTasks';

export const handbookData = [
  { id: 'basics', ...basicsData },
  { id: 'csharp', ...csharpData },
  { id: 'aspnet', ...aspnetData },
  { id: 'webapi', ...webapiData },
  { id: 'database', ...databaseData },
  { id: 'frontend', ...frontendData },
  { id: 'systemdesign', ...systemDesignData },
  { id: 'devops', ...devopsData },
  { id: 'tasks', ...codingTasks },
];

export { basicsData, csharpData, aspnetData, webapiData, databaseData, frontendData, systemDesignData, devopsData, codingTasks };
