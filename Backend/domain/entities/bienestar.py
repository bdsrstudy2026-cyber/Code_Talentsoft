"""
Entidades del módulo de bienestar laboral y evaluación de desempeño.

Corresponde a las tablas: evaluacion_desempeno, encuesta_bienestar,
registro_evento_institucional (Fase 3), y a las clases EvaluacionDesempeno,
EncuestaBienestar, RegistroEventoInstitucional del diagrama de clases
(Fase 4). Se relacionan con el ModuloBienestarLaboral.jar del diagrama
de despliegue.
"""

from __future__ import annotations
from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from domain.entities.personal import Empleado


class EvaluacionDesempeno:
    """
    Evaluación periódica de desempeño de un Empleado.

    Tabla relacional: `evaluacion_desempeno` (id_evaluacion,
    porcentaje_cumplido, observaciones, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_evaluacion: int,
        porcentaje_cumplido: Decimal,
        observaciones: str,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa una EvaluacionDesempeno.

        Args:
            id_evaluacion: PK en `evaluacion_desempeno`.
            porcentaje_cumplido: Porcentaje de cumplimiento de metas (0-100).
            observaciones: Comentarios cualitativos del evaluador.
            empleado: Empleado evaluado (FK).
        """
        self.id_evaluacion: int = id_evaluacion
        self.porcentaje_cumplido: Decimal = porcentaje_cumplido
        self.observaciones: str = observaciones
        self.empleado: Optional["Empleado"] = empleado

    def clasificar_desempeno(self) -> str:
        """
        Clasifica el desempeño en una categoría (bajo, medio, alto) a
        partir del porcentaje cumplido.

        Returns:
            Etiqueta textual de la categoría de desempeño.
        """
        pass


class EncuestaBienestar:
    """
    Respuesta de un Empleado a una encuesta de bienestar laboral.

    Tabla relacional: `encuesta_bienestar` (id_encuesta, fecha,
    resultado, observaciones, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_encuesta: int,
        fecha: date,
        resultado: str,
        observaciones: str,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa una EncuestaBienestar.

        Args:
            id_encuesta: PK en `encuesta_bienestar`.
            fecha: Fecha de realización de la encuesta.
            resultado: Resultado resumido de la encuesta.
            observaciones: Comentarios adicionales del empleado.
            empleado: Empleado que responde la encuesta (FK).
        """
        self.id_encuesta: int = id_encuesta
        self.fecha: date = fecha
        self.resultado: str = resultado
        self.observaciones: str = observaciones
        self.empleado: Optional["Empleado"] = empleado


class RegistroEventoInstitucional:
    """
    Participación de un Empleado en un evento institucional.

    Tabla relacional: `registro_evento_institucional` (id_evento,
    tipo_evento, fecha_evento, descripcion, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_evento: int,
        tipo_evento: str,
        fecha_evento: date,
        descripcion: str,
        empleado: Optional["Empleado"] = None,
    ) -> None:
        """
        Inicializa un RegistroEventoInstitucional.

        Args:
            id_evento: PK en `registro_evento_institucional`.
            tipo_evento: Tipo de evento (cultural, capacitación institucional, etc.).
            fecha_evento: Fecha del evento.
            descripcion: Detalle del evento.
            empleado: Empleado participante (FK).
        """
        self.id_evento: int = id_evento
        self.tipo_evento: str = tipo_evento
        self.fecha_evento: date = fecha_evento
        self.descripcion: str = descripcion
        self.empleado: Optional["Empleado"] = empleado
