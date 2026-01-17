import express from "express";
import { getLeadAnalytics, getLeadById, getLeads } from "../controller/LeadController.js";
import { ensureAuthenticated } from "../Middleware/isAuth.js";

const router=express.Router()



router.get("/",ensureAuthenticated,getLeads)
router.get("/:id",ensureAuthenticated,getLeadById)
router.get("/analytics", ensureAuthenticated, getLeadAnalytics);

export default router 