"""
Entidades del núcleo de personal.

Corresponde a las tablas: rol, Empleado, contrato, incentivo, diploma,
historial_laboral del modelo relacional (Fase 3), y a las clases
Rol, Empleado, Reclutador, Entrevistador, Capacitador, Contrato,
Incentivo, Diploma, HistorialLaboral del diagrama de clases (Fase 4).
"""

from __future__ import annotations
from abc import ABC
from datetime import date
from decimal import Decimal
from typing import Optional


class Rol:
    """
    Representa un rol organizacional (Administrador, Reclutador, etc.).

    Tabla relacional: `rol` (id_rol, nombre).
    Relación 1..N con Empleado (rol_asignado) y con HistorialLaboral
    (rol_del_evento).
    """

    def __init__(self, id_rol: int, nombre: str) -> None:
        """
        Inicializa un Rol.

        Args:
            id_rol: Identificador único del rol (PK en `rol`).
            nombre: Nombre descriptivo del rol.
        """
        self.id_rol: int = id_rol
        self.nombre: str = nombre

    def get_id_rol(self) -> int:
        """Retorna el identificador del rol."""
        pass

    def set_id_rol(self, id_rol: int) -> None:
        """Actualiza el identificador del rol."""
        pass

    def get_nombre(self) -> str:
        """Retorna el nombre del rol."""
        pass

    def set_nombre(self, nombre: str) -> None:
        """Actualiza el nombre del rol."""
        pass


class Empleado:
    """
    Entidad central del sistema TalentSoft.

    Tabla relacional: `Empleado` (id_Empleado, nombre, correo, contrasena,
    telefono, rol_id_rol FK, fecha_nacimiento). Es el punto de agregación
    de casi todas las tablas transaccionales del módulo de RRHH
    (asistencia, vacaciones, permisos, hora_extra, novedad_salud,
    evaluacion_desempeno, encuesta_bienestar, contrato, incentivo,
    diploma, historial_laboral, registro_evento_institucional).
    """

    def __init__(
        self,
        id_empleado: int,
        nombre: str,
        correo: str,
        contrasena: str,
        telefono: str,
        fecha_nacimiento: date,
        rol: Optional[Rol] = None,
    ) -> None:
        """
        Inicializa un Empleado.

        Args:
            id_empleado: PK en `Empleado`.
            nombre: Nombre completo.
            correo: Correo corporativo, usado como credencial de acceso.
            contrasena: Contraseña (debe almacenarse cifrada en persistencia).
            telefono: Número de contacto.
            fecha_nacimiento: Fecha de nacimiento.
            rol: Instancia de Rol asociada (FK rol_id_rol).
        """
        self.id_empleado: int = id_empleado
        self.nombre: str = nombre
        self.correo: str = correo
        self._contrasena: str = contrasena
        self.telefono: str = telefono
        self.fecha_nacimiento: date = fecha_nacimiento
        self.rol: Optional[Rol] = rol

    def get_id_empleado(self) -> int:
        """Retorna el identificador del empleado."""
        pass

    def set_id_empleado(self, id_empleado: int) -> None:
        """Actualiza el identificador del empleado."""
        pass

    def get_nombre(self) -> str:
        """Retorna el nombre del empleado."""
        pass

    def set_nombre(self, nombre: str) -> None:
        """Actualiza el nombre del empleado."""
        pass

    def get_correo(self) -> str:
        """Retorna el correo del empleado."""
        pass

    def set_correo(self, correo: str) -> None:
        """Actualiza el correo del empleado."""
        pass

    def set_contrasena(self, contrasena: str) -> None:
        """
        Actualiza la contraseña del empleado.

        La contraseña se mantiene encapsulada (atributo protegido); no se
        expone un getter directo por buenas prácticas de seguridad.
        """
        pass

    def verificar_contrasena(self, contrasena: str) -> bool:
        """
        Verifica una contraseña candidata contra la almacenada.

        Args:
            contrasena: Contraseña en texto plano a validar.

        Returns:
            True si coincide, False en caso contrario.
        """
        pass

    def get_telefono(self) -> str:
        """Retorna el teléfono del empleado."""
        pass

    def set_telefono(self, telefono: str) -> None:
        """Actualiza el teléfono del empleado."""
        pass

    def get_fecha_nacimiento(self) -> date:
        """Retorna la fecha de nacimiento del empleado."""
        pass

    def set_fecha_nacimiento(self, fecha_nacimiento: date) -> None:
        """Actualiza la fecha de nacimiento del empleado."""
        pass

    def get_rol(self) -> Optional[Rol]:
        """Retorna el Rol asignado al empleado."""
        pass

    def set_rol(self, rol: Rol) -> None:
        """Reasigna el Rol del empleado."""
        pass


class EmpleadoEspecializado(Empleado, ABC):
    """
    Clase base abstracta para las especializaciones de Empleado
    (Reclutador, Entrevistador, Capacitador) presentes en el diagrama
    de clases mediante herencia.

    No introduce nuevos atributos; existe para modelar el punto de
    extensión común y evitar duplicar lógica de identidad del empleado.
    Todas las subclases heredan el `__init__` de Empleado.
    """
    pass


class Reclutador(EmpleadoEspecializado):
    """
    Especialización de Empleado responsable de gestionar candidatos
    (relación `gestiona` hacia Candidato en el diagrama de clases).
    """

    def __init__(
        self,
        id_empleado: int,
        nombre: str,
        correo: str,
        contrasena: str,
        telefono: str,
        fecha_nacimiento: date,
        rol: Optional[Rol] = None,
    ) -> None:
        """Inicializa un Reclutador reutilizando el constructor de Empleado."""
        super().__init__(
            id_empleado, nombre, correo, contrasena, telefono,
            fecha_nacimiento, rol,
        )

    def gestionar_candidato(self, candidato: "Candidato") -> None:
        """
        Registra o actualiza un candidato dentro del proceso de selección.

        Args:
            candidato: Instancia de Candidato a gestionar.
        """
        pass


class Entrevistador(EmpleadoEspecializado):
    """
    Especialización de Empleado responsable de realizar entrevistas
    (relación `realiza` hacia Entrevista en el diagrama de clases).
    """

    def __init__(
        self,
        id_empleado: int,
        nombre: str,
        correo: str,
        contrasena: str,
        telefono: str,
        fecha_nacimiento: date,
        rol: Optional[Rol] = None,
    ) -> None:
        """Inicializa un Entrevistador reutilizando el constructor de Empleado."""
        super().__init__(
            id_empleado, nombre, correo, contrasena, telefono,
            fecha_nacimiento, rol,
        )

    def realizar_entrevista(self, entrevista: "Entrevista") -> None:
        """
        Registra la ejecución de una entrevista a un candidato.

        Args:
            entrevista: Instancia de Entrevista a realizar.
        """
        pass


class Capacitador(EmpleadoEspecializado):
    """
    Especialización de Empleado responsable de dictar capacitaciones
    (relación `dicta` hacia Capacitacion en el diagrama de clases).
    """

    def __init__(
        self,
        id_empleado: int,
        nombre: str,
        correo: str,
        contrasena: str,
        telefono: str,
        fecha_nacimiento: date,
        rol: Optional[Rol] = None,
    ) -> None:
        """Inicializa un Capacitador reutilizando el constructor de Empleado."""
        super().__init__(
            id_empleado, nombre, correo, contrasena, telefono,
            fecha_nacimiento, rol,
        )

    def dictar_capacitacion(self, capacitacion: "Capacitacion") -> None:
        """
        Asocia al capacitador como responsable de dictar una capacitación.

        Args:
            capacitacion: Instancia de Capacitacion a dictar.
        """
        pass


class Contrato:
    """
    Contrato laboral de un Empleado.

    Tabla relacional: `contrato` (id_contrato, tipo_contrato, fecha_inicio,
    Empleado_id_Empleado FK). El diagrama de clases añade fecha_fin y
    salario como atributos de negocio.
    """

    def __init__(
        self,
        id_contrato: int,
        tipo_contrato: str,
        fecha_inicio: date,
        fecha_fin: Optional[date],
        salario: Decimal,
        empleado: Optional[Empleado] = None,
    ) -> None:
        """
        Inicializa un Contrato.

        Args:
            id_contrato: PK en `contrato`.
            tipo_contrato: Tipo de contrato (fijo, indefinido, prestación, etc.).
            fecha_inicio: Fecha de inicio de vigencia.
            fecha_fin: Fecha de finalización (None si es indefinido).
            salario: Salario pactado.
            empleado: Empleado al que pertenece el contrato (FK).
        """
        self.id_contrato: int = id_contrato
        self.tipo_contrato: str = tipo_contrato
        self.fecha_inicio: date = fecha_inicio
        self.fecha_fin: Optional[date] = fecha_fin
        self.salario: Decimal = salario
        self.empleado: Optional[Empleado] = empleado

    def esta_vigente(self, fecha_referencia: date) -> bool:
        """
        Determina si el contrato está vigente en una fecha dada.

        Args:
            fecha_referencia: Fecha contra la cual evaluar la vigencia.

        Returns:
            True si el contrato sigue vigente, False en caso contrario.
        """
        pass


class Incentivo:
    """
    Incentivo o reconocimiento otorgado a un Empleado.

    Tabla relacional: `incentivo` (id_incentivo, tipo_incentivo,
    descripcion, fecha_otorgado, Empleado_id_Empleado FK).
    """

    def __init__(
        self,
        id_incentivo: int,
        tipo_incentivo: str,
        descripcion: str,
        fecha_otorgado: date,
        empleado: Optional[Empleado] = None,
    ) -> None:
        """
        Inicializa un Incentivo.

        Args:
            id_incentivo: PK en `incentivo`.
            tipo_incentivo: Categoría del incentivo (bono, reconocimiento, etc.).
            descripcion: Detalle del incentivo.
            fecha_otorgado: Fecha en que fue otorgado.
            empleado: Empleado beneficiario (FK).
        """
        self.id_incentivo: int = id_incentivo
        self.tipo_incentivo: str = tipo_incentivo
        self.descripcion: str = descripcion
        self.fecha_otorgado: date = fecha_otorgado
        self.empleado: Optional[Empleado] = empleado


class Diploma:
    """
    Diploma o certificación académica de un Empleado.

    Tabla relacional: `diploma` (id_diploma, nombre_diploma, institucion,
    Empleado_id_Empleado FK). El diagrama de clases añade fecha_obtencion.
    """

    def __init__(
        self,
        id_diploma: int,
        nombre_diploma: str,
        institucion: str,
        fecha_obtencion: date,
        empleado: Optional[Empleado] = None,
    ) -> None:
        """
        Inicializa un Diploma.

        Args:
            id_diploma: PK en `diploma`.
            nombre_diploma: Nombre del título o certificación.
            institucion: Institución emisora.
            fecha_obtencion: Fecha de obtención.
            empleado: Empleado titular (FK).
        """
        self.id_diploma: int = id_diploma
        self.nombre_diploma: str = nombre_diploma
        self.institucion: str = institucion
        self.fecha_obtencion: date = fecha_obtencion
        self.empleado: Optional[Empleado] = empleado


class HistorialLaboral:
    """
    Evento del historial laboral de un Empleado (ascenso, cambio de
    cargo, sanción, etc.).

    Tabla relacional: `historial_laboral` (id_historial, rol_id_rol FK,
    tipo_evento, fecha_evento, Empleado_id_Empleado FK). El diagrama de
    clases añade el atributo `cargo`.
    """

    def __init__(
        self,
        id_historial: int,
        cargo: str,
        tipo_evento: str,
        fecha_evento: date,
        empleado: Optional[Empleado] = None,
        rol: Optional[Rol] = None,
    ) -> None:
        """
        Inicializa un HistorialLaboral.

        Args:
            id_historial: PK en `historial_laboral`.
            cargo: Cargo asociado al evento.
            tipo_evento: Tipo de evento registrado.
            fecha_evento: Fecha del evento.
            empleado: Empleado afectado (FK).
            rol: Rol relacionado con el evento (FK rol_id_rol).
        """
        self.id_historial: int = id_historial
        self.cargo: str = cargo
        self.tipo_evento: str = tipo_evento
        self.fecha_evento: date = fecha_evento
        self.empleado: Optional[Empleado] = empleado
        self.rol: Optional[Rol] = rol
