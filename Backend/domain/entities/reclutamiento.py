"""
Entidades del módulo de reclutamiento y selección.

Corresponde a las tablas `candidato` y `entrevista` (Fase 3), y a las
clases Candidato y Entrevista del diagrama de clases (Fase 4). Se
relacionan con el ModuloReclutamientoSeleccion.jar del diagrama de
despliegue.
"""

from __future__ import annotations
from datetime import date, time
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from domain.entities.personal import Reclutador, Entrevistador


class Candidato:
    """
    Persona postulada a una vacante dentro del proceso de selección.

    Tabla relacional: `candidato` (id_candidato, documento, nombre,
    especialidad, estado, hoja_de_vida_pdf, Empleado_id_Empleado FK
    como reclutador gestor, entrevista_id_entrevista FK).
    """

    def __init__(
        self,
        id_candidato: int,
        documento: str,
        nombre: str,
        especialidad: str,
        estado: str,
        hoja_de_vida_pdf: str,
        reclutador: Optional["Reclutador"] = None,
    ) -> None:
        """
        Inicializa un Candidato.

        Args:
            id_candidato: PK en `candidato`.
            documento: Número de documento de identidad.
            nombre: Nombre completo del candidato.
            especialidad: Área o especialidad profesional.
            estado: Estado del proceso (postulado, en entrevista,
                contratado, descartado, etc.).
            hoja_de_vida_pdf: Ruta o referencia al archivo de hoja de vida.
            reclutador: Reclutador (Empleado) que gestiona al candidato (FK).
        """
        self.id_candidato: int = id_candidato
        self.documento: str = documento
        self.nombre: str = nombre
        self.especialidad: str = especialidad
        self.estado: str = estado
        self.hoja_de_vida_pdf: str = hoja_de_vida_pdf
        self.reclutador: Optional["Reclutador"] = reclutador

    def cambiar_estado(self, nuevo_estado: str) -> None:
        """
        Actualiza el estado del candidato dentro del proceso de selección.

        Args:
            nuevo_estado: Nuevo estado a asignar.
        """
        pass


class Entrevista:
    """
    Entrevista técnica realizada a un Candidato.

    Tabla relacional: `entrevista` (id_entrevista, fecha, hora,
    modalidad, calificacion_tecnica, observaciones_tecnicas,
    Empleado_id_Empleado FK como entrevistador).
    """

    def __init__(
        self,
        id_entrevista: int,
        fecha: date,
        hora: time,
        modalidad: str,
        calificacion_tecnica: Decimal,
        observaciones_tecnicas: str,
        candidato: Optional["Candidato"] = None,
        entrevistador: Optional["Entrevistador"] = None,
    ) -> None:
        """
        Inicializa una Entrevista.

        Args:
            id_entrevista: PK en `entrevista`.
            fecha: Fecha de la entrevista.
            hora: Hora de la entrevista.
            modalidad: Modalidad (presencial, virtual, telefónica).
            calificacion_tecnica: Calificación técnica obtenida.
            observaciones_tecnicas: Comentarios del entrevistador.
            candidato: Candidato entrevistado.
            entrevistador: Empleado (Entrevistador) que la realiza (FK).
        """
        self.id_entrevista: int = id_entrevista
        self.fecha: date = fecha
        self.hora: time = hora
        self.modalidad: str = modalidad
        self.calificacion_tecnica: Decimal = calificacion_tecnica
        self.observaciones_tecnicas: str = observaciones_tecnicas
        self.candidato: Optional["Candidato"] = candidato
        self.entrevistador: Optional["Entrevistador"] = entrevistador

    def aprobo(self, umbral: Decimal) -> bool:
        """
        Determina si la calificación técnica supera un umbral de aprobación.

        Args:
            umbral: Calificación mínima requerida para aprobar.

        Returns:
            True si calificacion_tecnica >= umbral, False en caso contrario.
        """
        pass
