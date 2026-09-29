// INTEGRA.GOV - AI Assistant Page
// INTEGRATION PENDING - AI capabilities require external service configuration
import { useState } from 'react';
import { Brain, Send, AlertTriangle, Info } from 'lucide-react';

export default function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; sources?: string[] }>>([
    { role: 'assistant', content: 'Olá! Sou o assistente de inteligência do INTEGRA.GOV. Posso auxiliar com análises de dados, identificação de padrões e apoio à auditoria. Como posso ajudar?' }
  ]);

  const handleQuery = () => {
    if (!query.trim()) return;
    
    const userMsg = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    
    // Simulated AI response based on available data patterns
    // In production, this would call an actual AI service
    let response = '';
    const q = query.toLowerCase();
    
    if (q.includes('contrato') && q.includes('atípico') || q.includes('anômal')) {
      response = 'Com base nos dados disponíveis, foram identificados padrões que requerem atenção:\n\n• Contrato CT-002/2024 apresenta 2 aditivos em período inferior a 6 meses, com aumento acumulado de 15.25% no valor.\n• Este padrão foi classificado como "ATENÇÃO" pelo motor de risco.\n\n**Fontes:** Base de contratos interna\n**Limitação:** Análise baseada apenas em dados disponíveis no sistema. Recomenda-se verificação documental.';
    } else if (q.includes('fornecedor') && q.includes('concentr')) {
      response = 'Análise de concentração de fornecedores:\n\n• Construtora Alfa LTDA: 5 contratos, valor total R$ 2.500.000,00\n• Engenharia Beta S.A.: 3 contratos, valor total R$ 1.800.000,00\n• Foi identificada relação de sócio em comum entre as empresas acima.\n\n**Fontes:** Base de fornecedores, base de empresas (junta comercial)\n**Limitação:** Dados de relacionamento empresarial podem estar incompletos.';
    } else if (q.includes('licitaç') && q.includes('baixa concorr')) {
      response = 'Licitações com baixa concorrência identificadas:\n\n• PE-002/2024: Apenas 1 participante (Construtora Alfa LTDA). Classificação: ATENÇÃO.\n\n**Fatores:** Baixa concorrência + Vencedor recorrente\n**Recomendação:** Análise humana para verificar se há fatores legítimos para a baixa participação.\n\n**Fontes:** Base de licitações interna\n**Limitação:** Não foi possível verificar se outros fornecedores foram convidados.';
    } else {
      response = 'Entendi sua pergunta. Com base nos dados disponíveis no sistema, posso auxiliar com:\n\n• Análise de padrões em contratos e licitações\n• Identificação de concentrações de fornecedores\n• Verificação de relacionamentos empresariais\n• Resumo de achados do motor de risco\n\nPara uma análise mais precisa, tente perguntas como:\n- "Quais contratos apresentam padrões atípicos?"\n- "Quais fornecedores possuem maior concentração?"\n- "Quais licitações tiveram baixa concorrência?"\n\n**Nota:** As respostas são baseadas exclusivamente nos dados do sistema e não substituem análise profissional.';
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        sources: ['Base de dados interna INTEGRA.GOV']
      }]);
    }, 500);
    
    setQuery('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />
          Assistente de Inteligência (IA)
        </h1>
        <p className="text-sm text-slate-500 mt-1">Auxílio à análise com inteligência artificial</p>
      </div>

      {/* Integration notice */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-violet-800">INTEGRAÇÃO PENDENTE</p>
            <p className="text-xs text-violet-700 mt-1">
              O módulo de IA está operando em modo demonstração com respostas pré-configuradas. 
              Para funcionalidade completa, é necessária a integração com serviço de LLM (Large Language Model). 
              A IA nunca inventará dados — toda resposta será baseada em evidências disponíveis e devidamente referenciada.
            </p>
          </div>
        </div>
      </div>

      {/* Chat interface */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] text-slate-500">Fontes: {msg.sources.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              placeholder="Ex: Quais contratos apresentam padrões atípicos?"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleQuery}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            As respostas são geradas com base nos dados disponíveis no sistema e não substituem análise profissional.
          </p>
        </div>
      </div>
    </div>
  );
}
