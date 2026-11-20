/* Formulario "Nueva Vacante" (equivale a #modalNuevaVacante del prototipo). */
import { useState } from 'react';
import Modal from '../ui/Modal';
import { AREAS } from '../../data/mockRecruitment';

const EMPTY_FORM = { title: '', area: 'confeccion', slots: 1 };

export default function NewVacancyModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await onSubmit({ ...form, title: form.title.trim() });
    setSaving(false);
    handleClose();
  };

  return (
    <Modal open={open} title="Nueva Vacante" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vacanteTitulo" className="mb-1.5 block text-sm font-medium text-ink">
            Cargo
          </label>
          <input
            id="vacanteTitulo"
            type="text"
            required
            value={form.title}
            onChange={setField('title')}
            placeholder="Ej: Operario de Fileteadora"
            className="field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vacanteArea" className="mb-1.5 block text-sm font-medium text-ink">
              Área
            </label>
            <select id="vacanteArea" value={form.area} onChange={setField('area')} className="field">
              {Object.entries(AREAS).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="vacanteCupos" className="mb-1.5 block text-sm font-medium text-ink">
              Cupos
            </label>
            <input
              id="vacanteCupos"
              type="number"
              min="1"
              value={form.slots}
              onChange={setField('slots')}
              className="field"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={handleClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando…' : 'Crear vacante'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
