import React, { useState } from 'react';

const SmtpConfig: React.FC = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '587',
    secure: 'false',
    user: '',
    password: '',
    fromEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSmtpConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      const response = await fetch('/api/admin/smtp-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smtpConfig),
      });
      
      if (response.ok) {
        setMessage({ text: 'Configuración SMTP guardada correctamente', type: 'success' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar la configuración SMTP');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage({ text: `Error: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      const response = await fetch('/api/admin/smtp-config/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smtpConfig),
      });
      
      if (response.ok) {
        setMessage({ text: 'Email de prueba enviado correctamente', type: 'success' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar email de prueba');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage({ text: `Error: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Configuración SMTP</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Host SMTP</label>
          <input
            type="text"
            name="host"
            value={smtpConfig.host}
            onChange={handleChange}
            placeholder="ej. smtp.gmail.com"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Puerto</label>
          <input
            type="text"
            name="port"
            value={smtpConfig.port}
            onChange={handleChange}
            placeholder="ej. 587"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Seguro (SSL/TLS)</label>
          <select
            name="secure"
            value={smtpConfig.secure}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="false">No</option>
            <option value="true">Sí</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Usuario SMTP</label>
          <input
            type="text"
            name="user"
            value={smtpConfig.user}
            onChange={handleChange}
            placeholder="ej. tu-email@gmail.com"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña SMTP</label>
          <input
            type="password"
            name="password"
            value={smtpConfig.password}
            onChange={handleChange}
            placeholder="Tu contraseña o contraseña de aplicación"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email Remitente</label>
          <input
            type="text"
            name="fromEmail"
            value={smtpConfig.fromEmail}
            onChange={handleChange}
            placeholder="ej. noreply@aeternus.ai"
            className="w-full p-2 border rounded"
          />
        </div>
        
        {message.text && (
          <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div className="flex space-x-2">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
          
          <button 
            onClick={handleTest}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            Enviar Email de Prueba
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmtpConfig;