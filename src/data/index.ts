import { csharpData } from './csharp';
import { basicsData } from './basics';
import { aspnetData } from './aspnet';
import { mvcoreData } from './mvcore';
import { webapiData } from './webapi';
import { databaseData } from './database';
import { frontendData, systemDesignData, devopsData } from './advanced';
import { codingTasks } from './codingTasks';
import { apiDocsContent } from './apidocs';
import { dotnet10Data } from './dotnet10';

export const handbookData = [
  { ...basicsData },
  { ...apiDocsContent },
  { ...csharpData },
  { ...aspnetData },
  { ...mvcoreData },
  { ...webapiData },
  { ...databaseData },
  { ...dotnet10Data },
  { ...frontendData },
  { ...systemDesignData },
  { ...devopsData },
  { ...codingTasks },
];

export { basicsData, csharpData, aspnetData, mvcoreData, apiDocsContent, webapiData, databaseData, dotnet10Data, frontendData, systemDesignData, devopsData, codingTasks };
