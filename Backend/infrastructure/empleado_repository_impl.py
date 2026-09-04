"""
Implementaciones concretas de persistencia para Empleado y Contrato.

Traducen las operaciones del contrato de dominio a sentencias SQL sobre
las tablas `Empleado` y `contrato` del modelo relacional (Fase 3),
usando la ConexionBD inyectada (composición) en lugar de heredar de ella.
"""

from __future__ import annotations
from typing import List, Optional

from domain.entities import Empleado, Rol, Contrato
from domain.repositories.repositories import RepositorioEmpleado, RepositorioContrato
from persistence.db_connection import ConexionBD


class RepositorioEmpleadoImpl(RepositorioEmpleado):
    """Implementación de RepositorioEmpleado sobre la tabla `Empleado`."""

    def __init__(self, conexion: ConexionBD) -> None:
        """
        Inicializa el repositorio con una conexión a base de datos.

        Args:
            conexion: Instancia de ConexionBD a utilizar (composición).
        """
        self.conexion: ConexionBD = conexion

    def guardar(self, entidad: Empleado) -> Empleado:
        pass

    def actualizar(self, entidad: Empleado) -> Empleado:
        pass

    def eliminar(self, id_entidad: int) -> bool:
        pass

    def buscar_por_id(self, id_entidad: int) -> Optional[Empleado]:
        pass

    def listar_todos(self) -> List[Empleado]:
        pass

    def buscar_por_correo(self, correo: str) -> Optional[Empleado]:
        pass

    def listar_por_rol(self, rol: Rol) -> List[Empleado]:
        pass


class RepositorioContratoImpl(RepositorioContrato):
    """Implementación de RepositorioContrato sobre la tabla `contrato`."""

    def __init__(self, conexion: ConexionBD) -> None:
        """
        Inicializa el repositorio con una conexión a base de datos.

        Args:
            conexion: Instancia de ConexionBD a utilizar (composición).
        """
        self.conexion: ConexionBD = conexion

    def guardar(self, entidad: Contrato) -> Contrato:
        pass

    def actualizar(self, entidad: Contrato) -> Contrato:
        pass

    def eliminar(self, id_entidad: int) -> bool:
        pass

    def buscar_por_id(self, id_entidad: int) -> Optional[Contrato]:
        pass

    def listar_todos(self) -> List[Contrato]:
        pass

    def listar_por_empleado(self, id_empleado: int) -> List[Contrato]:
        pass
