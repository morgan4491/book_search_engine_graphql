import type { Request, Response, NextFunction } from 'express';
import {Types} from 'mongoose';
import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

interface JwtPayload {
  user_id: Types.ObjectId;
}

/* 
  Function that pulls the token cookie from the client request and returns the user's id
  We seperate this function so we can use it for route callbacks or basic controller implentation (ie. getUser in auth_controller)
*/
export const getUserId = (req: Request) => {
  const token = req.cookies?.book_app_token;

  if (!token) return false;

  try {
    const { user_id } = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return user_id;

  } catch (error: any) {
    console.log('JWT VERIFICATON ERROR(auth.ts->getUserId)', error.message);

    return false;
  }
}

export const signToken = (user_id: Types.ObjectId) => {
  try {
    const token = sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: '12h' });
    
    return token;
  } catch (error) {
    console.log('JTW TOKEN CREATION ERROR(signToken)', error);
    return false;
  }
};

/* 
  Route middleware function that blocks an unauthenticated user from triggering a route and attaches the user_id to the req object
*/
export const blockGuest = async (req: Request, res: Response, next: NextFunction) => {
  // Get the user's id from the request cookie
  const user_id = getUserId(req);

  // If they don't have a cookie or valid JWT, they are not authorized
  if (!user_id) {
    res.status(401).json({
      message: 'You are not authorized to perform that action'
    });
    return;
  }

  // Attach the user's id to the request 
  req.user_id = user_id;

  // Call the next route callback function
  next();
};