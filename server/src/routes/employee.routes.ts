import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Middleware ensuring all employee endpoints require JWT and Employee/Admin role
router.use(authenticateJWT);
router.use(
  authorizeRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "DEVELOPER",
    "DESIGNER",
    "QA_ENGINEER",
    "HR",
    "SALES",
    "MARKETING",
    "FINANCE",
    "EMPLOYEE"
  )
);

import { Employee } from "../models/employee.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Meeting } from "../models/meeting.model.js";
import { Notification } from "../models/notification.model.js";

// Scoped Employee Endpoints (Strictly filtered by authenticated user ID)
router.get("/my/projects", async (req: any, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.userId });
    if (!employee) {
      return res.json({ success: true, projects: [] });
    }
    const projects = await Project.find({ _id: { $in: employee.assignedProjects || [] } }).populate("clientId", "companyName ownerName email name company");
    return res.json({ success: true, projects });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch projects" });
  }
});

router.get("/my/tasks", async (req: any, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId }).populate("projectId", "title");
    return res.json({ success: true, tasks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch tasks" });
  }
});

// --- MEETINGS: Shows meetings where this employee is invited ---
router.get("/my/meetings", async (req: any, res) => {
  try {
    const meetings = await Meeting.find({
      invitedEmployees: req.user.userId,
      status: { $ne: "cancelled" },
    }).sort({ meetingDate: 1 });
    return res.json({ success: true, meetings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch meetings" });
  }
});

// --- IN-APP NOTIFICATIONS ---
router.get("/my/notifications", async (req: any, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json({ success: true, notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch notifications" });
  }
});

// Mark a notification as read
router.patch("/my/notifications/:id/read", async (req: any, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.userId },
      { isRead: true }
    );
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update notification" });
  }
});

router.get("/my/timesheets", (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
    totalHoursThisWeek: 38.5,
    billableHours: 35.0,
    nonBillableHours: 3.5
  });
});

router.get("/my/attendance", (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
    status: "PRESENT",
    clockedInAt: "09:00 AM",
    totalToday: "4h 32m"
  });
});

export default router;

