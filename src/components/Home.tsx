import React, { useState } from 'react';

interface HomeProps {
  language: 'es' | 'pt';
  onStartQuestionnaire: (providerName: string, financialEntityName: string, userName: string) => void;
}

const Home: React.FC<HomeProps> = ({ language, onStartQuestionnaire }) => {
  const [providerName, setProviderName] = useState('');
  const [financialEntityName, setFinancialEntityName] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (providerName.trim() && financialEntityName.trim() && userName.trim()) {
      onStartQuestionnaire(providerName.trim(), financialEntityName.trim(), userName.trim());
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-3xl font-bold mb-4">
        {language === 'es' ? 'Bienvenido a DORA Analyzer' : 'Bem-vindo ao DORA Analyzer'}
      </h1>
      <p className="mb-6">
        {language === 'es'
          ? 'DORA Analyzer es una herramienta diseñada para evaluar  la conformidad con el Reglamento DORA (UE) 2022/2554.'
          : 'DORA Analyzer é uma ferramenta concebida para avaliar a conformidade com o Regulamento DORA (UE) 2022/2554.'}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="providerName">
            {language === 'es' ? 'Nombre del Proveedor TIC/Departamento' : 'Nome do Provedor TIC/Departamento'}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="providerName"
            type="text"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            placeholder={language === 'es' ? 'Ingrese el nombre del proveedor' : 'Digite o nome do provedor'}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="financialEntityName">
            {language === 'es' ? 'Nombre de la Entidad Financiera' : 'Nome da Entidade Financeira'}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="financialEntityName"
            type="text"
            value={financialEntityName}
            onChange={(e) => setFinancialEntityName(e.target.value)}
            placeholder={language === 'es' ? 'Ingrese el nombre de la entidad financiera' : 'Digite o nome da entidade financeira'}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            {language === 'es' ? 'Nombre de usuario' : 'Nome de usuário'}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={language === 'es' ? 'Ingrese su nombre de usuario' : 'Digite seu nome de usuário'}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {language === 'es' ? 'Iniciar Cuestionario' : 'Iniciar Questionário'}
        </button>
      </form>
    </div>
  );
};

export default Home;
