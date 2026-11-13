"""
Interfaces de repositorios específicos para cada entidad del dominio TalentSoft.
Heredan de RepositorioBase para mantener la consistencia en el acceso a datos.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from domain.repositories.base_repository import RepositorioBase
from domain.entities.personal import Empleado, Contrato
from domain.entities.asistencia import Asistencia, Permiso, Vacaciones
from domain.entities.bienestar import EvaluacionDesempeno
from domain.entities.capacitacion import Capacitacion, AsistenciaCapacitacion
from domain.entities.reclutamiento import Candidato, Entrevista


class RepositorioEmpleado(RepositorioBase[Empleado], ABC):
    """Interfaz para las operaciones de persistencia de Empleado."""

    @abstractmethod
    def buscar_por_correo(self, correo: str) -> Optional[Empleado]:
        """Busca un empleado por su correo electrónico institucional."""
        pass


class RepositorioContrato(RepositorioBase[Contrato], ABC):
    """Interfaz para las operaciones de persistencia de Contrato."""
    pass


class RepositorioAsistencia(RepositorioBase[Asistencia], ABC):
    """Interfaz para las operaciones de persistencia de Asistencia."""
    pass


class RepositorioPermiso(RepositorioBase[Permiso], ABC):
    """Interfaz para las operaciones de persistencia de Permiso."""
    pass


class RepositorioVacaciones(RepositorioBase[Vacaciones], ABC):
    """Interfaz para las operaciones de persistencia de Vacaciones."""
    pass


class RepositorioCandidato(RepositorioBase[Candidato], ABC):
    """Interfaz para las operaciones de persistencia de Candidato."""
    pass


class RepositorioEntrevista(RepositorioBase[Entrevista], ABC):
    """Interfaz para las operaciones de persistencia de Entrevista."""
    pass


class RepositorioCapacitacion(RepositorioBase[Capacitacion], ABC):
    """Interfaz para las operaciones de persistencia de Capacitacion."""
    pass


class RepositorioAsistenciaCapacitacion(RepositorioBase[AsistenciaCapacitacion], ABC):
    """Interfaz para las operaciones de persistencia de AsistenciaCapacitacion."""
    pass


class RepositorioEvaluacionDesempeno(RepositorioBase[EvaluacionDesempeno], ABC):
    """Interfaz para las operaciones de persistencia de EvaluacionDesempeno."""
    pass