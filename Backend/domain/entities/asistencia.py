"""
Entidades de control de asistencia y novedades del empleado.

Corresponde a las tablas: asistencia, hora_extra, permiso, vacaciones,
novedad_salud (Fase 3), y a las clases homónimas del diagrama de clases
(Fase 4). Todas mantienen una relación de composición 1..N con Empleado.
"""

from __future__ import annotations
from datetime import date, time
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from domain.entities.personal import Empleado


class Asistencia:
    """
    Registro diario de entrada/salida de un Empleado.

    Tabla relacional: `asistencia` (id_asistencia, fecha, hora_entrada,
    hora_salida, ausencia_justificada, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_asistencia: int,
        fecha: date,
        hora_entrada: time,
        hora_salida: Optional[time],
        ausencia_justificada: Optional[str],
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa un registro de Asistencia.

        Args:
            id_asistencia: PK en `asistencia`.
            fecha: Fecha del registro.
            hora_entrada: Hora de entrada.
            hora_salida: Hora de salida (None si aún no ha marcado salida).
            ausencia_justificada: Motivo de ausencia justificada, si aplica.
            empleado: Empleado al que pertenece el registro (FK).
        """
        self.id_asistencia: int = id_asistencia
        self.fecha: date = fecha
        self.hora_entrada: time = hora_entrada
        self.hora_salida: Optional[time] = hora_salida
        self.ausencia_justificada: Optional[str] = ausencia_justificada
        self.empleado: Optional["Empleado"] = empleado

    def calcular_horas_trabajadas(self) -> float:
        """
        Calcula las horas trabajadas en la jornada a partir de
        hora_entrada y hora_salida.

        Returns:
            Número de horas trabajadas (0.0 si no hay hora de salida).
        """
        pass


class HoraExtra:
    """
    Reporte de horas extra trabajadas por un Empleado.

    Tabla relacional: `hora_extra` (id_hora_extra, fecha, tipo,
    cantidad_hora, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_hora_extra: int,
        fecha: date,
        tipo: str,
        cantidad_hora: int,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa un reporte de HoraExtra.

        Args:
            id_hora_extra: PK en `hora_extra`.
            fecha: Fecha en que se realizaron las horas extra.
            tipo: Tipo de hora extra (diurna, nocturna, festiva, etc.).
            cantidad_hora: Cantidad de horas reportadas.
            empleado: Empleado que reporta (FK).
        """
        self.id_hora_extra: int = id_hora_extra
        self.fecha: date = fecha
        self.tipo: str = tipo
        self.cantidad_hora: int = cantidad_hora
        self.empleado: Optional["Empleado"] = empleado


class Permiso:
    """
    Solicitud de permiso laboral de un Empleado.

    Tabla relacional: `permiso` (id_permiso, motivacion, fecha_solicitud,
    estado, duracion_horas, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_permiso: int,
        motivacion: str,
        fecha_solicitud: date,
        estado: str,
        duracion_horas: int,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa una solicitud de Permiso.

        Args:
            id_permiso: PK en `permiso`.
            motivacion: Motivo de la solicitud.
            fecha_solicitud: Fecha en que se realizó la solicitud.
            estado: Estado actual (pendiente, aprobado, rechazado).
            duracion_horas: Duración solicitada en horas.
            empleado: Empleado solicitante (FK).
        """
        self.id_permiso: int = id_permiso
        self.motivacion: str = motivacion
        self.fecha_solicitud: date = fecha_solicitud
        self.estado: str = estado
        self.duracion_horas: int = duracion_horas
        self.empleado: Optional["Empleado"] = empleado

    def aprobar(self) -> None:
        """Cambia el estado de la solicitud a 'aprobado'."""
        pass

    def rechazar(self) -> None:
        """Cambia el estado de la solicitud a 'rechazado'."""
        pass


class Vacaciones:
    """
    Solicitud/registro de vacaciones de un Empleado.

    Tabla relacional: `vacaciones` (id_vacaciones, fecha_inicio,
    fecha_fin, estado, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_vacaciones: int,
        fecha_inicio: date,
        fecha_fin: date,
        estado: str,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa un registro de Vacaciones.

        Args:
            id_vacaciones: PK en `vacaciones`.
            fecha_inicio: Fecha de inicio del período.
            fecha_fin: Fecha de fin del período.
            estado: Estado actual (pendiente, aprobado, en curso, etc.).
            empleado: Empleado solicitante (FK).
        """
        self.id_vacaciones: int = id_vacaciones
        self.fecha_inicio: date = fecha_inicio
        self.fecha_fin: date = fecha_fin
        self.estado: str = estado
        self.empleado: Optional["Empleado"] = empleado

    def calcular_dias(self) -> int:
        """
        Calcula la cantidad de días entre fecha_inicio y fecha_fin.

        Returns:
            Número de días del período de vacaciones.
        """
        pass


class NovedadSalud:
    """
    Novedad de salud reportada por un Empleado (incapacidad, licencia
    médica, etc.).

    Tabla relacional: `novedad_salud` (id_novedad, tipo_novedad,
    descripcion, fecha_registro, fecha_vencimiento, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_novedad: int,
        tipo_novedad: str,
        descripcion: str,
        fecha_registro: date,
        fecha_vencimiento: Optional[date],
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa una NovedadSalud.

        Args:
            id_novedad: PK en `novedad_salud`.
            tipo_novedad: Tipo de novedad (incapacidad, licencia, etc.).
            descripcion: Detalle de la novedad.
            fecha_registro: Fecha en que se registró.
            fecha_vencimiento: Fecha de finalización, si aplica.
            empleado: Empleado que reporta la novedad (FK).
        """
        self.id_novedad: int = id_novedad
        self.tipo_novedad: str = tipo_novedad
        self.descripcion: str = descripcion
        self.fecha_registro: date = fecha_registro
        self.fecha_vencimiento: Optional[date] = fecha_vencimiento
        self.empleado: Optional["Empleado"] = empleado
