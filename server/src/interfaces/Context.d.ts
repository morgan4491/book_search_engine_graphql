import { Request, Response } from 'express';

export default interface Context {
    user_id: String;
    res: Response | any;
    req: Request | any;
}