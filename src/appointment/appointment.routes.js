import { Router } from "express";
import { listarCitas, saveAppointment, actualizarCita, cancelarCita } from "./appointment.controller.js";
import { createAppointmentValidator, updateAppointmentValidator, cancelAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.get("/user/:userId", listarCitas);
router.put("/updateAppointment/:appointmentId", updateAppointmentValidator, actualizarCita);
router.delete("/cancelAppointment/:appointmentId", cancelAppointmentValidator, cancelarCita);

export default router;