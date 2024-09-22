// @types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        userId: number; // ou string, dependendo do tipo de ID
        userName: string;
    }
}
