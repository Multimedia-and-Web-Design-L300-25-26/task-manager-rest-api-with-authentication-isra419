import Task from "../models/Task.js";
import type { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string };
    }
  }
}

// CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const task = await Task.create({
      title,
      user: req.user._id
    });

    res.status(201).json(task);

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message });
  }
};


// GET TASKS
export const getTasks = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tasks = await Task.find({ user: req.user._id });

    res.status(200).json(tasks);

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message });
  }
};


// DELETE TASK
export const deleteTask = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the logged-in user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message });
  }
};