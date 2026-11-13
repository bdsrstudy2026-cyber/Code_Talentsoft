"""Paquete de interfaces (contratos) de repositorio del dominio TalentSoft."""

from domain.repositories.base_repository import RepositorioBase
from domain.repositories.repositories import (
    RepositorioEmpleado,
    RepositorioContrato,
    RepositorioAsistencia,
    RepositorioPermiso,
    RepositorioVacaciones,
    RepositorioCandidato,
    RepositorioEntrevista,
    RepositorioCapacitacion,
    RepositorioAsistenciaCapacitacion,
    RepositorioEvaluacionDesempeno,
)

__all__ = [
    "RepositorioBase",
    "RepositorioEmpleado",
    "RepositorioContrato",
    "RepositorioAsistencia",
    "RepositorioPermiso",
    "RepositorioVacaciones",
    "RepositorioCandidato",
    "RepositorioEntrevista",
    "RepositorioCapacitacion",
    "RepositorioAsistenciaCapacitacion",
    "RepositorioEvaluacionDesempeno",
]
