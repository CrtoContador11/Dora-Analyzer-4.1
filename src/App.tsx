import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import Form from './components/Form';
import Report from './components/Report';
import SavedForms from './components/SavedForms';
import Drafts from './components/Drafts';
import Home from './components/Home';
import { FormData, Draft, Question, Category } from './types';

// Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = '7979728776:AAF37aFpjmflfHrW0ykXbbIUTcd57X1X-rc';
const TELEGRAM_CHAT_ID = '763968348';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'report' | 'savedForms' | 'drafts'>('home');
  const [language, setLanguage] = useState<'es' | 'pt'>('es');
  const [formData, setFormData] = useState<FormData[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userName, setUserName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [financialEntityName, setFinancialEntityName] = useState('');
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      text: {
        es: "¿{providerName} mantiene un inventario actualizado de los activos TIC que soportan los servicios prestados a {financialEntityName}?",
        pt: "{providerName} mantém um inventário atualizado dos ativos TIC que suportam os serviços prestados a {financialEntityName}?"
      },
      categoryId: 1,
      options: [
        { text: { es: "Sí", pt: "Sim" }, value: 100 },
        { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
        { text: { es: "No", pt: "Não" }, value: 0 },
        { text: { es: "No sé", pt: "Não sei" }, value: 25 }
      ]
    },
    {
      id: 2,
      text: {
        es: "¿{providerName} ha implementado políticas de seguridad de la información que incluyen la gestión de acceso, autenticidad, integridad y confidencialidad de los datos de {financialEntityName}?",
        pt: "{providerName} implementou políticas de segurança da informação que incluem a gestão de acesso, autenticidade, integridade e confidencialidade dos dados de {financialEntityName}?"
      },
      categoryId: 2,
      options: [
        { text: { es: "Sí", pt: "Sim" }, value: 100 },
        { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
        { text: { es: "No", pt: "Não" }, value: 0 },
        { text: { es: "No sé", pt: "Não sei" }, value: 25 }
      ]
    },
    {
      id: 3,
      text: {
        es: "¿{providerName} realiza evaluaciones de riesgo continuas sobre sus proveedores que prestan servicios a {financialEntityName}?",
        pt: "{providerName} realiza avaliações de risco contínuas sobre seus fornecedores que prestam serviços a {financialEntityName}?"
      },
      categoryId: 3,
      options: [
        { text: { es: "Sí", pt: "Sim" }, value: 100 },
        { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
        { text: { es: "No", pt: "Não" }, value: 0 },
        { text: { es: "No sé", pt: "Não sei" }, value: 25 }
      ]
    },
    {
      id: 4,
      text: {
        es: "¿{providerName} ha desarrollado y mantiene actualizado un plan de continuidad para los servicios TIC que gestiona para {financialEntityName}?",
        pt: "{providerName} desenvolveu e mantém atualizado um plano de continuidade para os serviços TIC que gere para {financialEntityName}?"
      },
      categoryId: 1,
      options: [
        { text: { es: "Sí", pt: "Sim" }, value: 100 },
        { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
        { text: { es: "No", pt: "Não" }, value: 0 },
        { text: { es: "No sé", pt: "Não sei" }, value: 25 }
      ]
    },
    {
      id: 5,
      text: {
        es: "¿{providerName} facilita auditorías periódicas de sus servicios TIC críticos, permitiendo que {financialEntityName} y reguladores verifiquen el cumplimiento con el DORA?",
        pt: "{providerName} facilita auditorias periódicas dos seus serviços TIC críticos, permitindo que {financialEntityName} e reguladores verifiquem a conformidade com o DORA?"
      },
      categoryId: 2,
      options: [
        { text: { es: "Sí", pt: "Sim" }, value: 100 },
        { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
        { text: { es: "No", pt: "Não" }, value: 0 },
        { text: { es: "No sé", pt: "Não sei" }, value: 25 }
      ]
    }
  ];

  const categories: Category[] = [
    {
      id: 1,
      name: {
        es: "Gestión de activos y continuidad",
        pt: "Gestão de ativos e continuidade"
      }
    },
    {
      id: 2,
      name: {
        es: "Seguridad y auditoría",
        pt: "Segurança e auditoria"
      }
    },
    {
      id: 3,
      name: {
        es: "Gestión de proveedores",
        pt: "Gestão de fornecedores"
      }
    }
  ];


  const sendTelegramMessage = async (data: FormData) => {
    const message = `
New form submitted:
Provider: ${data.providerName}
Financial Entity: ${data.financialEntityName}
User: ${data.userName}
Date: ${new Date(data.date).toLocaleString()}

Answers:
${Object.entries(data.answers).map(([id, value]) => `Question ${id}: ${value}`).join('\n')}
    `;

    try {
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      });
      console.log('Telegram message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData([...formData, data]);
    sendTelegramMessage(data);
    setCurrentView('report');
  };

  const handleSaveDraft = (draft: Draft) => {
    setDrafts([...drafts, draft]);
    setCurrentView('drafts');
  };

  const handleContinueDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    setCurrentView('form');
  };

  const handleDeleteDraft = (date: string) => {
    setDrafts(drafts.filter(draft => draft.date !== date));
  };

  const handleUpdateForm = (updatedForm: FormData) => {
    setFormData(formData.map(form => form.date === updatedForm.date ? updatedForm : form));
  };

  const handleDeleteForm = (dateToDelete: string) => {
    setFormData(formData.filter(form => form.date !== dateToDelete));
  };

  const handleStartQuestionnaire = (providerName: string, financialEntityName: string, userName: string) => {
    setProviderName(providerName);
    setFinancialEntityName(financialEntityName);
    setUserName(userName);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header version="v 4.1" userName={userName} language={language} setLanguage={setLanguage} />
      <Menu currentView={currentView} setCurrentView={setCurrentView} language={language} />
      <main className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        {currentView === 'home' && (
          <Home language={language} onStartQuestionnaire={handleStartQuestionnaire} />
        )}
        {currentView === 'form' && (
          <Form
            onSubmit={handleFormSubmit}
            onSaveDraft={handleSaveDraft}
            questions={questions}
            categories={categories}
            language={language}
            userName={userName}
            providerName={providerName}
            financialEntityName={financialEntityName}
            currentDraft={currentDraft}
          />
        )}
        {currentView === 'report' && (
          <Report formData={formData} questions={questions} categories={categories} language={language} />
        )}
        {currentView === 'savedForms' && (
          <SavedForms
            formData={formData}
            questions={questions}
            categories={categories}
            language={language}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
          />
        )}
        {currentView === 'drafts' && (
          <Drafts
            drafts={drafts}
            language={language}
            onContinueDraft={handleContinueDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        )}
      </main>
    </div>
  );
};

export default App;