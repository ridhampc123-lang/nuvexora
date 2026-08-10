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

import { Attendance } from "../models/attendance.model.js";
import { User } from "../models/user.model.js";
import { getIO } from "../socket/index.js";

// Helper to ensure Employee document exists for the logged in user
async function getOrCreateEmployee(user: any) {
  let emp = await Employee.findOne({ userId: user.userId });
  if (!emp && user.email) {
    emp = await Employee.findOne({ email: user.email.toLowerCase() });
  }
  if (!emp) {
    const userDoc: any = await User.findById(user.userId);
    const code = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    emp = await Employee.create({
      userId: user.userId,
      employeeId: code,
      name: userDoc?.name || user.name || "Nuvexora Employee",
      email: (userDoc?.email || user.email || `employee-${Date.now()}@nuvexora.com`).toLowerCase(),
      department: userDoc?.department || "Engineering",
      role: userDoc?.role || "EMPLOYEE",
      designation: userDoc?.jobTitle || "Software Engineer",
      employmentType: "FULL_TIME",
      status: "active",
    });
  } else if (!emp.userId) {
    emp.userId = user.userId;
    await emp.save();
  }
  return emp;
}

router.get("/my/timesheets", (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
    totalHoursThisWeek: 38.5,
    billableHours: 35.0,
    nonBillableHours: 3.5
  });
});

// GET /api/v1/employee/my/attendance - Fetch today status and history
router.get("/my/attendance", async (req: any, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user);
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayRecord = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const history = await Attendance.find({
      employeeId: employee._id
    }).sort({ date: -1 }).limit(30);

    const clockedIn = !!(todayRecord && todayRecord.checkIn && !todayRecord.checkOut);

    return res.json({
      success: true,
      employee,
      todayRecord,
      clockedIn,
      history
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch attendance" });
  }
});

// POST /api/v1/employee/my/check-in - Clock In
router.post("/my/check-in", async (req: any, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let todayRecord = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
      return res.status(400).json({ success: false, message: "You are already clocked in for today's shift." });
    }

    const now = new Date();
    const isLate = now.getHours() >= 10;

    if (todayRecord) {
      todayRecord.checkIn = now;
      todayRecord.checkOut = undefined;
      todayRecord.status = isLate ? "late" : "present";
      await todayRecord.save();
    } else {
      todayRecord = await Attendance.create({
        employeeId: employee._id,
        date: startOfToday,
        checkIn: now,
        status: isLate ? "late" : "present"
      });
    }

    try {
      getIO().emit("dashboard_update");
    } catch {}

    return res.json({
      success: true,
      message: "Successfully clocked in for today's shift.",
      attendance: todayRecord
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to check in" });
  }
});

// POST /api/v1/employee/my/check-out - Clock Out
router.post("/my/check-out", async (req: any, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let todayRecord = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const now = new Date();

    if (!todayRecord) {
      const defaultCheckIn = new Date();
      defaultCheckIn.setHours(9, 0, 0, 0);
      const totalMinutes = Math.max(0, Math.round((now.getTime() - defaultCheckIn.getTime()) / 60000));

      todayRecord = await Attendance.create({
        employeeId: employee._id,
        date: startOfToday,
        checkIn: defaultCheckIn,
        checkOut: now,
        totalWorkingMinutes: totalMinutes,
        status: "present"
      });
    } else {
      todayRecord.checkOut = now;
      const checkInMs = new Date(todayRecord.checkIn).getTime();
      const totalMinutes = Math.max(0, Math.round((now.getTime() - checkInMs) / 60000));
      todayRecord.totalWorkingMinutes = totalMinutes;
      await todayRecord.save();
    }

    try {
      getIO().emit("dashboard_update");
    } catch {}

    return res.json({
      success: true,
      message: "Successfully clocked out. Today's shift hours have been logged.",
      attendance: todayRecord
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to check out" });
  }
});

import { LeaveRequest } from "../models/leave-request.model.js";

// GET /api/v1/employee/my/leave-requests
router.get("/my/leave-requests", async (req: any, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user);
    const requests = await LeaveRequest.find({ employeeId: employee._id })
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch leave requests" });
  }
});

// POST /api/v1/employee/my/leave-requests
router.post("/my/leave-requests", async (req: any, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user);
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Type, start date, end date, and reason are required." });
    }

    const leaveTypeLower = (type || "casual").toLowerCase();

    const leave = await LeaveRequest.create({
      employeeId: employee._id,
      type: leaveTypeLower,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "pending"
    });

    try {
      getIO().emit("dashboard_update");
    } catch {}

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully. Awaiting admin approval.",
      request: leave
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to submit leave request" });
  }
});

export default router;

