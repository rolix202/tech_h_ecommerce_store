import { dbQuery } from "../configs/conn.js";
import AppError from "../utils/customError.js";

export const createUserQuery = async (data) => {
    const { name, email, phoneNo, gender, state, city, address, password, verificationToken, verificationTokenExpiresAt } = data

    const queryText = `INSERT INTO users (name, email, phoneNo, gender, state, city, address, password, verificationtoken, verificationtokenexpiresat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, name, email, phoneNo, gender, state, city, address, status, lastlogin`;

    try {
        const { rows } = await dbQuery(queryText, [name, email, phoneNo, gender, state, city, address, password, verificationToken, verificationTokenExpiresAt])

        return rows[0]
        
    } catch (error) {
        console.log("Error creating user:", error);
        throw error 
    }
}

export const loginUserQuery = async (email) => {
  try {
    const queryText = `SELECT id FROM users WHERE email = $1 LIMIT 1`;

    const { rows } = await dbQuery(queryText, [email]);

    if (rows.length === 0) {
      throw new AppError("Invalid email or password", 401);
    }

    return rows[0];
  } catch (error) {
    console.log("Error login user:", error);
    throw error;
  }
};

export const getUserPassword = async (email) => {

  const queryText = `SELECT password FROM users WHERE email = $1`;

  const { rows } = await dbQuery(queryText, [email]);

  return rows[0];
};

export const getUserByIdQuery = async (id) => {
    try {
        const queryText = `SELECT id, name, email, phoneNo, gender, state, city, address, status, role, lastlogin FROM users WHERE id = $1 LIMIT 1`;
    
        const { rows } = await dbQuery(queryText, [id]);
    
        if (rows.length === 0) {
          throw new AppError("User not found.", 404);
        }
    
        return rows[0];
      } catch (error) {
        console.log("Error Authenticating user:", error);
        throw error;
      }
}

export const verifyEmailTokenQuery = async (token) => {

  const queryText = `SELECT id, name, email, verificationtokenexpiresat FROM users WHERE verificationtoken = $1 LIMIT 1`

  try {
    const { rows } = await dbQuery(queryText, [token])
    
    return rows.length ? rows[0] : null
    
  } catch (error) {
    console.error("Error fetching user by verification token:", error);
    throw error 
  }
  
}

export const updateUserVerification = async (userId) => {
  const queryText = `UPDATE users SET isverified = true, verificationtoken = null, verificationtokenexpiresat = null WHERE id = $1`

  try {
    await dbQuery(queryText, [userId])

  } catch (error) {
    console.error("Error updating user status", error);
    throw error
  }
}