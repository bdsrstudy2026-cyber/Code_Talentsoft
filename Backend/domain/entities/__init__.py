"""
Paquete de entidades de dominio de TalentSoft.

Reexporta las clases de cada submódulo para permitir importaciones
simplificadas, p. ej.:

    from domain.entities import Empleado, Candidato, Contrato
"""

from domain.entities.personal import (
    Rol,
    Empleado,
    EmpleadoEspecializado,
    Reclutador,
    Entrevistador,
    Capacitador,
    Contrato,
    Incentivo,
    Diploma,
    HistorialLaboral,
)
from domain.entities.asistencia import (
    Asistencia,
    HoraExtra,
    Permiso,
    Vacaciones,
    NovedadSalud,
)
from domain.entities.bienestar import (
    EvaluacionDesempeno,
    EncuestaBienestar,
    RegistroEventoInstitucional,
)
from domain.entities.capacitacion import Capacitacion, AsistenciaCapacitacion
from domain.entities.reclutamiento import Candidato, Entrevista

__all__ = [
    "Rol",
    "Empleado",
    "EmpleadoEspecializado",
    "Reclutador",
    "Entrevistador",
    "Capacitador",
    "Contrato",
    "Incentivo",
    "Diploma",
    "HistorialLaboral",
    "Asistencia",
    "HoraExtra",
    "Permiso",
    "Vacaciones",
    "NovedadSalud",
    "EvaluacionDesempeno",
    "EncuestaBienestar",
    "RegistroEventoInstitucional",
    "Capacitacion",
    "AsistenciaCapacitacion",
    "Candidato",
    "Entrevista",
]
