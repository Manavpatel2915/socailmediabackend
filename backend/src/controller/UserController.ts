import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/sqldbconnnect";

const JWT_SECRET = process.env.JWT_SECRET as string;

const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await db.User.create({
      username,
      email,
      password,
      role,
    });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(
    password,
    (user as any).password
  );

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    user: {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
  });
};


const logout =async (
  req:Request,
  res:Response
):Promise<Response>=>
  {
  
  return res.status(201).send({message:"succesfully logout"});

  
}
export { register, 
          login,
          logout,
          
         };
