import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const createAppointmentValidator = [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("pet").notEmpty().withMessage("La mascota es requerida"),
    body("pet").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];

export const updateAppointmentValidator = [
    param("appointmentId").isMongoId().withMessage("No es un ID válido de MongoDB"),
    body("date").optional().isISO8601().withMessage("Fecha inválida"),
    body("pet").optional().isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];

export const cancelAppointmentValidator = [
    param("appointmentId").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];
