"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Middleware ensuring all employee endpoints require JWT and Employee/Admin role
router.use(auth_middleware_1.authenticateJWT);
router.use((0, auth_middleware_1.authorizeRoles)("SUPER_ADMIN", "ADMIN", "MANAGER", "DEVELOPER", "DESIGNER", "QA_ENGINEER", "HR", "SALES", "MARKETING", "FINANCE", "EMPLOYEE"));
const employee_model_js_1 = require("../models/employee.model.js");
const project_model_js_1 = require("../models/project.model.js");
const task_model_js_1 = require("../models/task.model.js");
const meeting_model_js_1 = require("../models/meeting.model.js");
const notification_model_js_1 = require("../models/notification.model.js");
// Scoped Employee Endpoints (Strictly filtered by authenticated user ID)
router.get("/my/projects", async (req, res) => {
    try {
        const employee = await employee_model_js_1.Employee.findOne({ userId: req.user.userId });
        if (!employee) {
            return res.json({ success: true, projects: [] });
        }
        const projects = await project_model_js_1.Project.find({ _id: { $in: employee.assignedProjects || [] } }).populate("clientId", "companyName ownerName email name company");
        return res.json({ success: true, projects });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch projects" });
    }
});
router.get("/my/tasks", async (req, res) => {
    try {
        const tasks = await task_model_js_1.Task.find({ assignedTo: req.user.userId }).populate("projectId", "title");
        return res.json({ success: true, tasks });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch tasks" });
    }
});
// --- MEETINGS: Shows meetings where this employee is invited ---
router.get("/my/meetings", async (req, res) => {
    try {
        const employee = await employee_model_js_1.Employee.findOne({
            $or: [{ userId: req.user.userId }, { email: req.user.email }],
        });
        const candidateIds = [req.user.userId];
        if (employee) {
            candidateIds.push(employee._id);
            if (employee.userId)
                candidateIds.push(employee.userId);
        }
        const meetings = await meeting_model_js_1.Meeting.find({
            $or: [
                { invitedEmployees: { $in: candidateIds } },
                { organizerEmail: req.user.email },
            ],
            status: { $ne: "cancelled" },
        })
            .populate("invitedEmployees", "name email role")
            .sort({ meetingDate: 1 });
        return res.json({ success: true, meetings });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch meetings" });
    }
});
// --- IN-APP NOTIFICATIONS ---
router.get("/my/notifications", async (req, res) => {
    try {
        const notifications = await notification_model_js_1.Notification.find({ recipientId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        return res.json({ success: true, notifications });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch notifications" });
    }
});
// Mark a notification as read
router.patch("/my/notifications/:id/read", async (req, res) => {
    try {
        await notification_model_js_1.Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.user.userId }, { isRead: true });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to update notification" });
    }
});
// Helper to ensure Employee document exists for the logged in user
const attendance_model_js_1 = require("../models/attendance.model.js");
const user_model_js_1 = require("../models/user.model.js");
const index_js_1 = require("../socket/index.js");
async function getOrCreateEmployee(user) {
    let emp = await employee_model_js_1.Employee.findOne({ userId: user.userId });
    if (!emp && user.email) {
        emp = await employee_model_js_1.Employee.findOne({ email: user.email.toLowerCase() });
    }
    if (!emp) {
        const userDoc = await user_model_js_1.User.findById(user.userId);
        const code = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        emp = await employee_model_js_1.Employee.create({
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
    }
    else if (!emp.userId) {
        emp.userId = user.userId;
        await emp.save();
    }
    return emp;
}
router.get("/my/timesheets", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        const records = await attendance_model_js_1.Attendance.find({
            employeeId: employee._id,
            date: { $gte: startOfWeek }
        });
        let totalMinutes = 0;
        for (const rec of records) {
            totalMinutes += (rec.totalWorkingMinutes || 0);
        }
        const totalHoursThisWeek = parseFloat((totalMinutes / 60).toFixed(1));
        return res.json({
            success: true,
            user: req.user,
            totalHoursThisWeek,
            billableHours: totalHoursThisWeek,
            nonBillableHours: 0
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to calculate timesheets" });
    }
});
// GET /api/v1/employee/my/attendance - Fetch today status and history
router.get("/my/attendance", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const todayRecord = await attendance_model_js_1.Attendance.findOne({
            employeeId: employee._id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        const history = await attendance_model_js_1.Attendance.find({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch attendance" });
    }
});
// POST /api/v1/employee/my/check-in - Clock In
router.post("/my/check-in", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        let todayRecord = await attendance_model_js_1.Attendance.findOne({
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
        }
        else {
            todayRecord = await attendance_model_js_1.Attendance.create({
                employeeId: employee._id,
                date: startOfToday,
                checkIn: now,
                status: isLate ? "late" : "present"
            });
        }
        try {
            (0, index_js_1.getIO)().emit("dashboard_update");
        }
        catch { }
        return res.json({
            success: true,
            message: "Successfully clocked in for today's shift.",
            attendance: todayRecord
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to check in" });
    }
});
// POST /api/v1/employee/my/check-out - Clock Out
router.post("/my/check-out", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        let todayRecord = await attendance_model_js_1.Attendance.findOne({
            employeeId: employee._id,
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        const now = new Date();
        if (!todayRecord) {
            const defaultCheckIn = new Date();
            defaultCheckIn.setHours(9, 0, 0, 0);
            const totalMinutes = Math.max(0, Math.round((now.getTime() - defaultCheckIn.getTime()) / 60000));
            todayRecord = await attendance_model_js_1.Attendance.create({
                employeeId: employee._id,
                date: startOfToday,
                checkIn: defaultCheckIn,
                checkOut: now,
                totalWorkingMinutes: totalMinutes,
                status: "present"
            });
        }
        else {
            todayRecord.checkOut = now;
            const checkInMs = new Date(todayRecord.checkIn).getTime();
            const totalMinutes = Math.max(0, Math.round((now.getTime() - checkInMs) / 60000));
            todayRecord.totalWorkingMinutes = totalMinutes;
            await todayRecord.save();
        }
        try {
            (0, index_js_1.getIO)().emit("dashboard_update");
        }
        catch { }
        return res.json({
            success: true,
            message: "Successfully clocked out. Today's shift hours have been logged.",
            attendance: todayRecord
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to check out" });
    }
});
const leave_request_model_js_1 = require("../models/leave-request.model.js");
// GET /api/v1/employee/my/leave-requests
router.get("/my/leave-requests", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const requests = await leave_request_model_js_1.LeaveRequest.find({ employeeId: employee._id })
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 });
        return res.json({ success: true, requests });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch leave requests" });
    }
});
// POST /api/v1/employee/my/leave-requests
router.post("/my/leave-requests", async (req, res) => {
    try {
        const employee = await getOrCreateEmployee(req.user);
        const { type, startDate, endDate, reason } = req.body;
        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: "Type, start date, end date, and reason are required." });
        }
        const leaveTypeLower = (type || "casual").toLowerCase();
        const leave = await leave_request_model_js_1.LeaveRequest.create({
            employeeId: employee._id,
            type: leaveTypeLower,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "pending"
        });
        try {
            (0, index_js_1.getIO)().emit("dashboard_update");
        }
        catch { }
        return res.status(201).json({
            success: true,
            message: "Leave request submitted successfully. Awaiting admin approval.",
            request: leave
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to submit leave request" });
    }
});
exports.default = router;
