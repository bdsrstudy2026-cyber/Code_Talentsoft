"""
Gestión de la conexión a la base de datos.

Según el diagrama de despliegue (Fase 4), el motor de persistencia es
MySQL 8.0 alojado en un `Servidor de Base de Datos (Google Cloud)`,
accedido vía TCP/IP - JDBC (puerto 3306) desde el servidor de
aplicaciones. Esta clase encapsula esa conexión sin comprometerse a
ninguna librería concreta (p. ej. mysql-connector-python), dejando el
detalle de implementación fuera del alcance de esta fase de maquetación.
"""

from __future__ import annotations
from typing import Any, Optional


class ConfiguracionBD:
    """Parámetros de configuración para la conexión a la base de datos."""

    def __init__(
        self,
        host: str,
        puerto: int,
        nombre_bd: str,
        usuario: str,
        contrasena: str,
    ) -> None:
        """
        Inicializa la ConfiguracionBD.

        Args:
            host: Host o IP del servidor de base de datos.
            puerto: Puerto de conexión (3306 según diagrama de despliegue).
            nombre_bd: Nombre del esquema (BD_TalentSoft).
            usuario: Usuario de conexión.
            contrasena: Contraseña de conexión.
        """
        self.host: str = host
        self.puerto: int = puerto
        self.nombre_bd: str = nombre_bd
        self.usuario: str = usuario
        self._contrasena: str = contrasena


class ConexionBD:
    """
    Encapsula el ciclo de vida de una conexión a la base de datos
    (patrón Singleton / gestor de contexto), desacoplando a los
    repositorios concretos del driver específico que se elija más
    adelante (p. ej. JDBC vía puente, o un conector nativo de Python).
    """

    def __init__(self, configuracion: ConfiguracionBD) -> None:
        """
        Inicializa la ConexionBD con su configuración asociada.

        Args:
            configuracion: Parámetros de conexión (ConfiguracionBD).
        """
        self.configuracion: ConfiguracionBD = configuracion
        self._conexion_activa: Optional[Any] = None

    def conectar(self) -> None:
        """Abre la conexión física con la base de datos MySQL."""
        pass

    def desconectar(self) -> None:
        """Cierra la conexión activa con la base de datos."""
        pass

    def ejecutar_consulta(self, sentencia_sql: str, parametros: Optional[tuple] = None) -> list:
        """
        Ejecuta una sentencia SQL de consulta (SELECT).

        Args:
            sentencia_sql: Sentencia SQL parametrizada a ejecutar.
            parametros: Tupla de parámetros para la sentencia.

        Returns:
            Lista de filas resultantes (representadas como tuplas o dicts).
        """
        pass

    def ejecutar_actualizacion(self, sentencia_sql: str, parametros: Optional[tuple] = None) -> int:
        """
        Ejecuta una sentencia SQL de modificación (INSERT/UPDATE/DELETE).

        Args:
            sentencia_sql: Sentencia SQL parametrizada a ejecutar.
            parametros: Tupla de parámetros para la sentencia.

        Returns:
            Número de filas afectadas.
        """
        pass

    def __enter__(self) -> "ConexionBD":
        """Permite usar la conexión como gestor de contexto (`with`)."""
        pass

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        """Cierra la conexión automáticamente al salir del bloque `with`."""
        pass
