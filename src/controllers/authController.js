import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

 try {

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
   return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
   email,
   password: hashedPassword
  });

  res.status(201).json({
   id: user._id,
   email: user.email
  });

 } catch (error) {
  const message = error instanceof Error ? error.message : "An error occurred";
  res.status(500).json({ message });
 }

};



export const login = async (req, res) => {

 try {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
   return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
   return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
   { id: user._id },
   process.env.JWT_SECRET || "",
   { expiresIn: "1d" }
  );

  res.json({ token });

 } catch (error) {
  const message = error instanceof Error ? error.message : "An error occurred";
  res.status(500).json({ message });
 }

};