/**
 * JWT Token Generator - Creates signed authentication tokens
 * 
 * Generates JWT with userId payload, 7-day expiration
 * Uses JWT_SECRET from environment variables
 * Token stored in HTTP-only cookie for security
 */
import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default genToken;
