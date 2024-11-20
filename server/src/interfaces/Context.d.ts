import { Request, Response } from 'express';

export default interface Context {
    res: Response | any;
    req: Request | any;
}