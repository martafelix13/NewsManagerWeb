// {
//   user: '11',
//   group: '11',
//   username: 'DEV_TEAM_02',
//   Authorization: 'PUIRESTAUTH',
//   apikey: 'DEV_TEAM_02_',
//   expires: '2024-10-13 05:46:42',
// }

export interface User {
  user: number;
  group: number;
  username: string;
  Authorization: string,
  apikey: string,
  expires: Date
}
