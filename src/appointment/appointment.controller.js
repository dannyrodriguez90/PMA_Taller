import Pet from "../pet/pet.model.js";
import Appointment from "./appointment.model.js"; // Asegúrate de importar tu modelo correctamente
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;
    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    }); 
  }
};

export const listarCitas = async (req, res) => {
  let { userId } = req.params;
  userId = userId.trim();

  try {
    const appointments = await Appointment.find({ user: userId });

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron citas para este usuario",
      });
    }

    res.status(200).json({
      success: true,
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las citas del usuario",
      error,
    });
  }
};

export const actualizarCita = async (req, res) => {
  const { appointmentId } = req.params;
  const data = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la cita",
      });
    }

    if (data.date) {
      const isoDate = new Date(data.date);
      if (isNaN(isoDate.getTime())) {
        return res.status(400).json({
          success: false,
          msg: "Fecha inválida",
        });
      }
      data.date = isoDate;
    }

    Object.assign(appointment, data);
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: "Cita actualizada exitosamente",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al actualizar la cita",
      error,
    });
  }
};

export const cancelarCita = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la cita",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Cita cancelada exitosamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al cancelar la cita",
      error: error.message,
    });
  }
};