// found at https://github.com/auth0/express-jwt-authz/issues/25

// declare module 'express-jwt-authz' {
//     export interface IAuthzOptions {
//         failWithError: boolean;
//         checkAllScopes: boolean;
//         customScopeKey: string;
//     }

//     export default function(expectedScopes: string[], options?: IAuthzOptions): (req: Request, res: Response, next: NextFunction) => void;
// }