"""
Contrato abstracto de persistencia (patrón Repository).

Define la interfaz que debe cumplir cualquier implementación concreta
de acceso a datos, independientemente del motor de base de datos.
Esto desacopla el dominio y los servicios de negocio de los detalles
de persistencia (MySQL 8.0 / JDBC, según el diagrama de despliegue),
cumpliendo el principio de inversión de dependencias.
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")
K = TypeVar("K")


class RepositorioBase(ABC, Generic[T, K]):
    """
    Interfaz genérica de repositorio CRUD.

    Type Params:
        T: Tipo de entidad de dominio gestionada.
        K: Tipo de la clave primaria de la entidad.
    """

    @abstractmethod
    def guardar(self, entidad: T) -> T:
        """
        Inserta una nueva entidad en el medio de persistencia.

        Args:
            entidad: Instancia a insertar.

        Returns:
            La entidad persistida (posiblemente con su PK asignada).
        """
        pass

    @abstractmethod
    def actualizar(self, entidad: T) -> T:
        """
        Actualiza una entidad existente.

        Args:
            entidad: Instancia con los datos actualizados.

        Returns:
            La entidad actualizada.
        """
        pass

    @abstractmethod
    def eliminar(self, id_entidad: K) -> bool:
        """
        Elimina una entidad por su identificador.

        Args:
            id_entidad: Clave primaria de la entidad a eliminar.

        Returns:
            True si se eliminó correctamente, False si no existía.
        """
        pass

    @abstractmethod
    def buscar_por_id(self, id_entidad: K) -> Optional[T]:
        """
        Busca una entidad por su identificador.

        Args:
            id_entidad: Clave primaria a buscar.

        Returns:
            La entidad encontrada o None si no existe.
        """
        pass

    @abstractmethod
    def listar_todos(self) -> List[T]:
        """
        Lista todas las entidades almacenadas.

        Returns:
            Lista de todas las entidades del tipo T.
        """
        pass
