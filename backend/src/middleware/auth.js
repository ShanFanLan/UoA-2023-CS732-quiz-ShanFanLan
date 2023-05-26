import jwt from "jsonwebtoken";
import { User } from "../db/schema";

/**
 * Middleware to verify the JWT token in the authorization header in the request
 *
 * @param {*} req obtains the authorization header from here
 * @param {*} res used to send a 401 status if not authenticated
 * @param {*} next called if authenticated
 * @returns an HTTP 401 to the client if not authenticated. Otherwise, proceed to the next middleware in the chain.
 */
export default async function verifyToken(req, res, next) {
  let token = req.headers["authorization"]; // Check header

  // If no token provided, send a 401, don't continue.
  if (!token) return res.sendStatus(401);

  try {
    // get rid of the "Bearer " bit at the front
    token = token.slice(token.indexOf(" ") + 1);

    // Decode the token and if it succeeds, stick the DB User object into the req for all to use,
    // then continue processing the request
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id);
    if (!user) return res.sendStatus(401);
    req.user = user;
    return next();
  } catch (err) {
    // If token verification fails, send a 401, don't continue
    return res.sendStatus(401);
  }
}

// Create a JWT for the given username, expures in 24h by default
export function createToken(_id, username, expiresIn = "24h") {
  return jwt.sign({ _id, username }, process.env.JWT_KEY, { expiresIn });
}
