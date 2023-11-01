// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //TODO: qui il token è fisso per esempio, da creare il backend per l'autenticazione
  tokenJwt:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBbG5hbyIsImlhdCI6MTY5ODc2MjA3MywiZXhwIjoxNzMwMjk4MDczLCJhdWQiOiIiLCJzdWIiOiIifQ.u2dTFKoKeQkvplmN8uPwYJ340ibtwHHzo1Hrj8_HHCQ',
  filmsEndpoint:'https://8ade8uccx3.execute-api.eu-west-1.amazonaws.com/dev'
};
