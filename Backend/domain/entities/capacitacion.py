"""
Entidades del módulo de capacitaciones.

Corresponde a las tablas `capacitacion` y `asistencia_capacitacion`
(Fase 3), y a las clases Capacitacion y AsistenciaCapacitacion del
diagrama de clases (Fase 4). AsistenciaCapacitacion es una clase de
asociación (composición) que resuelve la relación N..M entre Empleado
y Capacitacion, replicando la tabla intermedia con llave compuesta
(capacitacion_id_capacitacion, Empleado_id_Empleado).
"""

from __future__ import annotations
from datetime import date, time
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from domain.entities.personal import Empleado, Capacitador


class Capacitacion:
    """
    Actividad de capacitación ofrecida por la organización.

    Tabla relacional: `capacitacion` (id_capacitacion, tema,
    lugar_plataforma, fecha, hora, Empleado_id_Empleado FK como
    capacitador que la dicta).
    """

    def __init__(
        self,
        id_capacitacion: int,
        tema: str,
        lugar_plataforma: str,
        fecha: date,
        hora: time,
        capacitador: Optional["Capacitador"] = None,
    ) -> None:
        """
        Inicializa una Capacitacion.

        Args:
            id_capacitacion: PK en `capacitacion`.
            tema: Tema o título de la capacitación.
            lugar_plataforma: Lugar físico o plataforma virtual.
            fecha: Fecha en que se dicta.
            hora: Hora de inicio.
            capacitador: Empleado (Capacitador) responsable de dictarla (FK).
        """
        self.id_capacitacion: int = id_capacitacion
        self.tema: str = tema
        self.lugar_plataforma: str = lugar_plataforma
        self.fecha: date = fecha
        self.hora: time = hora
        self.capacitador: Optional["Capacitador"] = capacitador


class AsistenciaCapacitacion:
    """
    Clase de asociación entre Empleado y Capacitacion.

    Tabla relacional: `asistencia_capacitacion` (capacitacion_id_capacitacion
    FK + Empleado_id_Empleado FK como llave compuesta, estado_asistencia).
    Modela la relación `asiste_capacitacion` / `incluye` del diagrama de
    clases mediante composición explícita en lugar de una relación N..M
    directa entre Empleado y Capacitacion.
    """

    def __init__(
        self,
        capacitacion: "Capacitacion",
        empleado: "Empleado",
        estado_asistencia: str,
    ) -> None:
        """
        Inicializa un registro de AsistenciaCapacitacion.

        Args:
            capacitacion: Capacitacion a la que se asiste (parte de la
                llave compuesta).
            empleado: Empleado asistente (parte de la llave compuesta).
            estado_asistencia: Estado de la asistencia (inscrito, asistió,
                inasistente, etc.).
        """
        self.capacitacion: "Capacitacion" = capacitacion
        self.empleado: "Empleado" = empleado
        self.estado_asistencia: str = estado_asistencia

    def marcar_asistencia(self, estado: str) -> None:
        """
        Actualiza el estado de asistencia del empleado a la capacitación.

        Args:
            estado: Nuevo estado de asistencia.
        """
        pass
