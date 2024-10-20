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
      es: "¿{financialEntityName} ha evidenciado estar trabajando en el cumplimiento del reglamento DORA?",
      pt: "{financialEntityName} evidenciou estar a trabalhar no cumprimento do regulamento DORA?"
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
      es: "¿{financialEntityName} ha solicitado información a {providerName} sobre algún aspecto de cumplimiento de DORA?",
      pt: "{financialEntityName} solicitou informações a {providerName} sobre algum aspeto de conformidade com o DORA?"
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
    id: 3,
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
    id: 4,
    text: {
      es: "¿{financialEntityName} tiene acceso al inventario actualizado de activos gestionados por {providerName}? ¿Lo ha solicitado?",
      pt: "{financialEntityName} tem acesso ao inventário atualizado dos ativos geridos por {providerName}? Solicitou-o?"
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
    id: 6,
    text: {
      es: "{financialEntityName} debe realizar un análisis de riesgos de los activos proporcionados por {providerName} ¿Hay constancia de que sea así? ¿Por ejemplo, {financialEntityName} ha pedido detalles de algún activo para poder evaluar riesgos?",
      pt: "{financialEntityName} deve realizar uma análise de riscos dos ativos fornecidos por {providerName}. Há evidências disso? Por exemplo, {financialEntityName} pediu detalhes de algum ativo para poder avaliar riscos?"
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
    id: 7,
    text: {
      es: "¿{providerName} sabe a qué funciones de negocio de {financialEntityName} esos activos dan soporte?",
      pt: "{providerName} sabe a que funções de negócio de {financialEntityName} esses ativos dão suporte?"
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
    id: 8,
    text: {
      es: "¿{providerName} sabe si las funciones de negocio de {financialEntityName} soportadas son críticas o importantes?",
      pt: "{providerName} sabe se as funções de negócio de {financialEntityName} suportadas são críticas ou importantes?"
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
    id: 9,
    text: {
      es: "Si se conocen las funciones de negocio de {financialEntityName} soportadas ¿Se mantienen documentadas y se actualizan periódicamente?",
      pt: "Se se conhecem as funções de negócio de {financialEntityName} suportadas, são mantidas documentadas e atualizadas periodicamente?"
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
    id: 10,
    text: {
      es: "¿{providerName} sabe si los servicios prestados a {financialEntityName} constituyen una externalización completa o parcial?",
      pt: "{providerName} sabe se os serviços prestados a {financialEntityName} constituem uma externalização completa ou parcial?"
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
    id: 11,
    text: {
      es: "Si los servicios prestados constituyen una externalización, {financialEntityName} debe realizar una evaluación de riesgo ¿le consta a {providerName} que la haya hecho?",
      pt: "Se os serviços prestados constituem uma externalização, {financialEntityName} deve realizar uma avaliação de risco. Sabe {providerName} se isso foi feito?"
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
    id: 12,
    text: {
      es: "¿Conoce la política de seguridad definida por {providerName}?",
      pt: "Conhece a política de segurança definida por {providerName}?"
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
    id: 13,
    text: {
      es: "¿Conoce su impacto en la gestión de acceso, autenticidad, integridad y confidencialidad de la información de {financialEntityName} o que se comparte con {financialEntityName}?",
      pt: "Conhece o impacto na gestão de acesso, autenticidade, integridade e confidencialidade da informação de {financialEntityName} ou que é partilhada com {financialEntityName}?"
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
    id: 14,
    text: {
      es: "¿El alcance de la certificación ISO 27001 de {providerName} incluye todos los servicios TIC prestados a {financialEntityName}?",
      pt: "O âmbito da certificação ISO 27001 de {providerName} inclui todos os serviços TIC prestados a {financialEntityName}?"
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
    id: 15,
    text: {
      es: "¿Se ha revisado el contrato con {financialEntityName} para asegurar su adecuación a los requisitos de DORA?",
      pt: "O contrato com {financialEntityName} foi revisto para assegurar a sua conformidade com os requisitos do DORA?"
    },
    categoryId: 4,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 16,
    text: {
      es: "¿Se han documentado en el contrato todas las ubicaciones desde las que {providerName} presta servicio (incluyendo soporte), así como el lugar donde se almacenarán los datos?",
      pt: "Estão documentadas no contrato todas as localizações a partir das quais {providerName} presta serviços (incluindo suporte), bem como o local onde os dados serão armazenados?"
    },
    categoryId: 4,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 17,
    text: {
      es: "¿Existen cláusulas contractuales que regulan o impidan la subcontratación de servicios por parte de {providerName}?",
      pt: "Existem cláusulas contratuais que regulam ou impedem a subcontratação de serviços por parte de {providerName}?"
    },
    categoryId: 4,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 18,
    text: {
      es: "¿{providerName} ha implementado un proceso formal de evaluación y auditoría de sus subcontratas para los servicios TIC prestados a {financialEntityName}, garantizando que cumplen con los requisitos exigidos por el contrato?",
      pt: "{providerName} implementou um processo formal de avaliação e auditoria das suas subcontratações para os serviços TIC prestados a {financialEntityName}, garantindo que cumprem os requisitos exigidos pelo contrato?"
    },
    categoryId: 7,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 19,
    text: {
      es: "¿{providerName} garantiza que el contenido de los contratos corresponde fielmente al servicio que se está prestando a {financialEntityName}, en lo que respecta al detalle de los servicios y a los SLAs?",
      pt: "{providerName} garante que o conteúdo dos contratos corresponde fielmente ao serviço que está a ser prestado a {financialEntityName}, no que respeita ao detalhe dos serviços e aos SLAs?"
    },
    categoryId: 7,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 20,
    text: {
      es: "¿El contrato detalla las obligaciones y los términos en los cuales {providerName} ha de prestar asistencia técnica y operativa a {financialEntityName} en caso de ocurrir un incidente?",
      pt: "O contrato detalha as obrigações e os termos nos quais {providerName} deve prestar assistência técnica e operacional a {financialEntityName} em caso de incidente?"
    },
    categoryId: 8,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 21,
    text: {
      es: "¿El contrato establece los costes aplicables a {financialEntityName} por la asistencia durante incidentes, garantizando que no hay costes adicionales o que se hayan acordado previamente?",
      pt: "O contrato estabelece os custos aplicáveis a {financialEntityName} pela assistência durante incidentes, garantindo que não há custos adicionais ou que foram previamente acordados?"
    },
    categoryId: 8,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 22,
    text: {
      es: "¿El personal de {providerName} que opera o gestiona los servicios conoce los procedimientos de gestión de incidentes de {financialEntityName} para operar conforme a ellos si se diese el caso?",
      pt: "O pessoal de {providerName} que opera ou gere os serviços conhece os procedimentos de gestão de incidentes de {financialEntityName} para operar de acordo com eles, se for o caso?"
    },
    categoryId: 9,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 23,
    text: {
      es: "¿El contrato incluye cláusulas sobre derechos de acceso a instalaciones y de solicitud de información a {providerName} por parte de {financialEntityName} o de organismos reguladores?",
      pt: "O contrato inclui cláusulas sobre direitos de acesso a instalações e pedidos de informação a {providerName} por parte de {financialEntityName} ou dos organismos reguladores?"
    },
    categoryId: 10,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 24,
    text: {
      es: "¿Ha solicitado {financialEntityName} que {providerName} participe en programas de formación específicos desarrollados por {financialEntityName} para garantizar que {providerName} está alineado con los estándares y procedimientos internos del cliente?",
      pt: "{financialEntityName} solicitou que {providerName} participe em programas de formação específicos desenvolvidos por {financialEntityName} para garantir que {providerName} está alinhado com as normas e procedimentos internos do cliente?"
    },
    categoryId: 11,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 25,
    text: {
      es: "¿El contrato con {financialEntityName} establece disposiciones claras y documentadas para garantizar el acceso, recuperación y devolución de datos personales y no personales procesados en caso de insolvencia, resolución, discontinuación de operaciones por parte de {providerName} o finalización del acuerdo contractual?",
      pt: "O contrato com {financialEntityName} estabelece disposições claras e documentadas para garantir o acesso, recuperação e devolução de dados pessoais e não pessoais processados em caso de insolvência, dissolução, descontinuação das operações por parte de {providerName} ou rescisão do contrato?"
    },
    categoryId: 12,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 26,
    text: {
      es: "¿El contrato con {financialEntityName} define claramente los derechos de rescisión del contrato de {financialEntityName}, asegurando el cumplimiento de los plazos de preaviso mínimos exigidos por las autoridades competentes?",
      pt: "O contrato com {financialEntityName} define claramente os direitos de rescisão do contrato por parte de {financialEntityName}, garantindo o cumprimento dos prazos mínimos de pré-aviso exigidos pelas autoridades competentes?"
    },
    categoryId: 13,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 27,
    text: {
      es: "¿Ha solicitado {financialEntityName} a {providerName} la participación en pruebas de penetración basadas en amenazas (TLPT) u otras pruebas similares (TIBER EU)?",
      pt: "{financialEntityName} solicitou a participação de {providerName} em testes de penetração baseados em ameaças (TLPT) ou outros testes similares (TIBER UE)?"
    },
    categoryId: 15,
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
      es: "Localización de servicios y datos",
      pt: "Localização de serviços e dados"
    }
  },
  {
    id: 2,
    name: {
      es: "Análisis de riesgos",
      pt: "Análise de riscos"
    }
  },
  {
    id: 3,
    name: {
      es: "Protección de datos",
      pt: "Proteção de dados"
    }
  },
  {
    id: 4,
    name: {
      es: "Evaluación de subcontratados y proveedores",
      pt: "Avaliação de subcontratados e fornecedores"
    }
  },
  {
    id: 7,
    name: {
      es: "Niveles de Servicio",
      pt: "Níveis de Serviço"
    }
  },
  {
    id: 8,
    name: {
      es: "Asistencia en caso de incidentes",
      pt: "Assistência em caso de incidentes"
    }
  },
  {
    id: 9,
    name: {
      es: "Plazos de notificación y obligaciones de información",
      pt: "Prazos de notificação e obrigações de informação"
    }
  },
  {
    id: 10,
    name: {
      es: "Supervisión y auditorías continuas",
      pt: "Supervisão e auditorias contínuas"
    }
  },
  {
    id: 11,
    name: {
      es: "Aprendizaje y evolución",
      pt: "Aprendizagem e evolução"
    }
  },
  {
    id: 12,
    name: {
      es: "Disposiciones para el acceso, recuperación y devolución de datos",
      pt: "Disposições para o acesso, recuperação e devolução de dados"
    }
  },
  {
    id: 13,
    name: {
      es: "Derechos de rescisión",
      pt: "Direitos de rescisão"
    }
  },
  {
    id: 15,
    name: {
      es: "Pruebas TLPT",
      pt: "Testes TLPT"
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
