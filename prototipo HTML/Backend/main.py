from domain.entities.personal import Rol, Empleado, Contrato
from datetime import date
from decimal import Decimal

# 1. Crear un Rol
rol_admin = Rol(id_rol=1, nombre="Administrador")

# 2. Crear un Empleado con la clase que programaste
empleado1 = Empleado(
    id_empleado=101,
    nombre="Brayan Sierra",
    correo="bsierra@talentsoft.com",
    contrasena="claveSegura123",
    telefono="3001234567",
    fecha_nacimiento=date(2000, 5, 15),
    rol=rol_admin
)

# 3. Crear un Contrato asociado al Empleado
contrato1 = Contrato(
    id_contrato=1,
    tipo_contrato="Indefinido",
    fecha_inicio=date(2026, 1, 1),
    fecha_fin=None,
    salario=Decimal("2500000"),
    empleado=empleado1
)

# 4. Probar la ejecución en consola
print(f"Empleado registrado: {empleado1.nombre}")
print(f"Rol asignado: {empleado1.rol.nombre}")
print(f"Tipo de contrato: {contrato1.tipo_contrato} - Salario: ${contrato1.salario}")