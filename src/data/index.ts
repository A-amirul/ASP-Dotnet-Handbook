import { csharpData } from './csharp';
import { basicsData } from './basics';
import { aspnetData } from './aspnet';
import { mvcoreData } from './mvcore';
import { webapiData } from './webapi';
import { databaseData } from './database';
import { frontendData, systemDesignData, devopsData } from './advanced';
import { codingTasks } from './codingTasks';
import { apiDocsContent } from './apidocs';

export const handbookData = [
  { id: 'basics', ...basicsData },
  { ...apiDocsContent },
  { id: 'csharp', ...csharpData },
  { id: 'aspnet', ...aspnetData },
  { id: 'mvcore', ...mvcoreData },
  { id: 'webapi', ...webapiData },
  { id: 'database', ...databaseData },
  { id: 'frontend', ...frontendData },
  { id: 'systemdesign', ...systemDesignData },
  { id: 'devops', ...devopsData },
  { id: 'tasks', ...codingTasks },
];

export { basicsData, csharpData, aspnetData, mvcoreData,apiDocsContent, webapiData, databaseData, frontendData, systemDesignData, devopsData, codingTasks };
