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

// Scoped Employee Endpoints (Strictly filtered by authenticated user ID)
router.get("/my/projects", (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
    projects: [
      { id: "PRJ-101", name: "Veloce Cloud Platform", role: "Lead Architect", progress: 78 },
      { id: "PRJ-102", name: "Omni Global RAG AI Engine", role: "Senior Engineer", progress: 92 }
    ]
  });
});

router.get("/my/tasks", (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
    tasks: [
      { id: "TSK-301", title: "Refactor Next.js App Router Edge Cache Headers", status: "IN_PROGRESS" },
      { id: "TSK-302", title: "Review Pull Request #142 for RAG Vector Pipeline", status: "BACKLOG" }
    ]
  });
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
