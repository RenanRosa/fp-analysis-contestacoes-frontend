import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Lock, Database, Scale, ShieldCheck } from 'lucide-react';
import './Landing.css';

const Landing: React.FC = () => {
    return (
        <div className="landing-content">
            <div className="ambient ambient-1"></div>
            <div className="ambient ambient-2"></div>
            <div className="ambient ambient-3"></div>
            <div className="grid-lines"></div>

            {/* NAVIGATION */}
            <nav>
                <div className="nav-brand">
                    <img src="/logo_fundo_preto.png" alt="FP Analysis Logo" className="nav-logo-custom" />

                </div>
                <div className="nav-links">
                    <a href="#como-funciona">Como Funciona</a>
                    <a href="#funcionalidades">Funcionalidades</a>
                    <a href="#metricas">Resultados</a>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="btn btn-ghost">Entrar</Link>

                </div>
            </nav>

            {/* HERO */}
            <div className="hero">
                <div className="hero-eyebrow fade-up d1">
                    <div className="eyebrow-line"></div>
                    <span className="eyebrow-text">Motor Cognitivo Jurídico &middot; IA Corporativa</span>
                </div>
                <h1 className="hero-title fade-up d2">
                    Da petição inicial à contestação em <em>segundos.</em>
                </h1>
                <p className="hero-desc fade-up d3">
                    Reduza gargalos operacionais. Eleve o padrão técnico.
                </p>
                <div className="hero-actions fade-up d4">
                    <Link to="/login" className="btn btn-cta btn-lg">Começar Agora &rarr;</Link>

                </div>

                <div className="hero-stat-row fade-up d5">
                    <div className="hero-stat">
                        <span className="stat-number">Em segundos</span>
                        <span className="stat-label">Contestação gerada</span>
                    </div>
                    <div className="hero-stat">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Foco no seu fluxo jurídico</span>
                    </div>
                    <div className="hero-stat">
                        <span className="stat-number">&infin;</span>
                        <span className="stat-label">Escala de processamento</span>
                    </div>
                    <div className="hero-stat">
                        <span className="stat-number">&mdash;0</span>
                        <span className="stat-label">Petições genéricas sem resposta</span>
                    </div>
                </div>
            </div>

            {/* MARQUEE */}
            <div className="marquee-section">
                <div className="marquee-track">
                    {/* set 1 */}
                    <div className="marquee-item"><div className="marquee-dot"></div>Leitura Rápida de Petições</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Extração de Tese e Contexto</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Integração RAG Automática</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Geração em Alta Velocidade</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Fundamentação Jurídica</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Exportação Direta em .docx</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Privacidade Garantida</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Escalabilidade Ilimitada</div>
                    {/* set 2 (duplicate for infinite loop) */}
                    <div className="marquee-item"><div className="marquee-dot"></div>Leitura Rápida de Petições</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Extração de Tese e Contexto</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Integração RAG Automática</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Geração em Alta Velocidade</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Fundamentação Jurídica</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Exportação Direta em .docx</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Privacidade Garantida</div>
                    <div className="marquee-item"><div className="marquee-dot"></div>Escalabilidade Ilimitada</div>
                </div>
            </div>



            {/* FEATURES */}
            <section className="features-section" id="funcionalidades">
                <div className="container">
                    {/* Feature 1: Reader */}
                    <div className="feature-row">
                        <div className="feature-text">
                            <h3 className="feature-title">Motor que <em>compreende</em>,<br />não apenas lê.</h3>
                            <p className="feature-desc">
                                O avaliador visual interpreta a lógica da petição jurídica: identifica o pedido principal, as teses que ele tenta provar e os fatos declarados &mdash; sem precisar de configurações avançadas por parte do advogado.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="visual-header">
                                <div className="dot dot-red"></div>
                                <div className="dot dot-yellow"></div>
                                <div className="dot dot-green"></div>
                                <span className="visual-title">processamento &mdash; Analisador Visual</span>
                            </div>
                            <div className="visual-body">
                                <div className="ocr-visual">
                                    <div className="ocr-doc">
                                        <div className="ocr-scan-line"></div>
                                        <div className="ocr-lines">
                                            <div className="ocr-line w100"></div>
                                            <div className="ocr-line w80"></div>
                                            <div className="ocr-line hl w90"></div>
                                            <div className="ocr-line w60"></div>
                                            <div className="ocr-line w100"></div>
                                            <div className="ocr-line hl w70"></div>
                                            <div className="ocr-line w80"></div>
                                            <div className="ocr-line w90"></div>
                                            <div className="ocr-line w60"></div>
                                            <div className="ocr-line w100"></div>
                                            <div className="ocr-line w70"></div>
                                        </div>
                                    </div>
                                    <div className="ocr-arrow">&rarr;</div>
                                    <div className="ocr-output">
                                        <div className="ocr-tag">&#123; <span>pedido</span>: "Danos Morais",</div>
                                        <div className="ocr-tag"><span>valor</span>: "R$ 12.000,00",</div>
                                        <div className="ocr-tag"><span>fatos</span>: ["Corte de sinal", "Sem notificação"],</div>
                                        <div className="ocr-tag"><span>tese</span>: "CDC Art. 14",</div>
                                        <div className="ocr-tag"><span>confiança</span>: <span style={{ color: 'var(--accent)' }}>98.7%</span> &#125;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Strategy */}
                    <div className="feature-row reverse">
                        <div className="feature-text">
                            <h3 className="feature-title">Mapeamento de<br /><em>pontos fortes e fracos.</em></h3>
                            <p className="feature-desc">
                                Antes de redigir a defesa, a inteligência mapeia o risco da ação. A IA sugere as melhores linhas argumentativas baseadas no histórico da empresa, indicando vulnerabilidades no argumento do autor e onde atacar.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="visual-header">
                                <div className="dot dot-red"></div>
                                <div className="dot dot-yellow"></div>
                                <div className="dot dot-green"></div>
                                <span className="visual-title">painel_estrategia &mdash; Análise de Risco</span>
                            </div>
                            <div className="visual-body">
                                <div className="strategy-report">
                                    <div className="sr-header">
                                        RELATÓRIO ESTRATÉGICO DE CASO &middot; USO INTERNO
                                    </div>
                                    <div>
                                        <span style={{ color: '#fff' }}>Processo:</span> 1005300-67.2025.8.00.0000<br />
                                        <span style={{ color: '#fff' }}>Partes:</span> Autor Genérico x Companhia S/A<br />
                                        <span style={{ color: '#fff' }}>Assunto:</span> Inexistência de Débito e Danos Morais
                                    </div>

                                    <div className="sr-title">1. Resumo do Caso</div>
                                    O autor alega desconhecer relação contratual com a empresa e pleiteia a declaração de inexigibilidade do débito juntamente com indenização por danos morais devido à restrição de crédito.

                                    <div className="sr-title">2. Análise Probatória</div>
                                    <div className="sr-sub green">2.1. Nossas Forças:</div>
                                    <ul className="sr-list">
                                        <li><strong>Súmula 385 do STJ:</strong> O autor possui múltiplas positivações de restrições de crédito anteriores ativas, o que afasta o dever de indenizar danos morais.</li>
                                        <li><strong>Log de Autenticação Biométrico:</strong> Localizamos no acervo interno o IP e a selfie de contratação do autor, validando a legitimidade do negócio jurídico.</li>
                                        <li><strong>Advocacia Predatória:</strong> O causídico atrelado aos autos figura no cluster de ofensores de risco alto, operando em massa no mesmo nicho de litigância.</li>
                                    </ul>

                                    <div className="sr-sub">2.2. Nossas Fraquezas:</div>
                                    <ul className="sr-list">
                                        <li>Inversão do ônus da prova típica das relações de consumo (CDC).</li>
                                    </ul>

                                    <div className="sr-title">3. Classificação Final de Risco</div>
                                    <div style={{ color: '#7acba9', fontWeight: 600, marginBottom: '4px' }}>Risco Tolerável / Baixo</div>
                                    A base probatória da companhia aliada ao histórico pré-existente do autor neutraliza as chances substanciais de procedência na esfera indenizatória, restando, no pior cenário, apenas a exigibilidade do débito material principal.

                                    <div className="sr-title">4. Recomendações de Estratégia</div>
                                    <ul className="sr-list">
                                        <li>Anexar atestado antifraude logado no ato da compra pelo autor.</li>
                                        <li>Requerer ofícios à Receita Federal frente aos indícios de lide temerária.</li>
                                        <li><strong>Acordo:</strong> Retenção ativa. A alta probabilidade técnica de ganho diminui viabilidade de concessões.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Generation */}
                    <div className="feature-row">
                        <div className="feature-text">
                            <h3 className="feature-title">Defesa redigida.<br /><em>Pronta para protocolo.</em></h3>
                            <p className="feature-desc">
                                Com todas as peças no tabuleiro, a esteira cruza o que foi extraído na petição da parte com as regras pré-informadas pela sua empresa. Em uma fração do tempo usual, expõe-se o documento final exportável em .docx.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="visual-header">
                                <div className="dot dot-red"></div>
                                <div className="dot dot-yellow"></div>
                                <div className="dot dot-green"></div>
                                <span className="visual-title">motor_redacao &mdash; Automação Jurídica</span>
                            </div>
                            <div className="visual-body">
                                <div className="gen-visual">
                                    <div className="gen-prompt">
                                        <span style={{ color: 'var(--muted)' }}>CONTEXTO:</span> Proc. #2025-02-1104 &middot; Pedido: Danos Morais por Corte de Sinal<br />
                                        <span style={{ color: 'var(--muted)' }}>SUBSÍDIOS:</span> Contrato nº 887.223 &middot; Log de Ativação &middot; Notificação prévia 72h<br />
                                        <span style={{ color: 'var(--muted)' }}>TAREFA:</span> Redigir contestação completa em linguagem jurídica forense
                                    </div>
                                    <div className="gen-output">
                                        <div className="gen-output-text">
                                            EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO...<br /><br />
                                            I &mdash; DA ILEGITIMIDADE DO PEDIDO<br />
                                            Conforme disposto no contrato nº 887.223, Cláusula 8.2, a Requerida procedeu à suspensão do serviço após notificação com antecedência de 72 horas, em plena conformidade com o art. 56 da Resolução ANATEL...<br /><br />
                                            II &mdash; DA INEXISTÊNCIA DE DANO MORAL<br />
                                            Os logs de ativação acostados aos autos demonstram...<span className="gen-cursor"></span>
                                        </div>
                                    </div>
                                    <div className="gen-badge">
                                        <div className="gen-badge-dot"></div>
                                        GERANDO CONTESTAÇÃO &middot; 8.4s &middot; 847 tokens
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4: Chat QA */}
                    <div className="feature-row reverse">
                        <div className="feature-text">
                            <h3 className="feature-title">Pergunte à IA.<br /><em>Respostas imediatas sobre o processo.</em></h3>
                            <p className="feature-desc">
                                Ficou com dúvida sobre algum detalhe da petição ou não encontrou um subsídio? Converse diretamente com o Agente Especializado. Ele lê centenas de páginas do processo e responde suas perguntas com citações diretas aos autos.
                            </p>
                        </div>
                        <div className="feature-visual">
                            <div className="visual-header">
                                <div className="dot dot-red"></div>
                                <div className="dot dot-yellow"></div>
                                <div className="dot dot-green"></div>
                                <span className="visual-title">chat_especialista &mdash; QA Operacional</span>
                            </div>
                            <div className="visual-body" style={{ background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                                    <div style={{ alignSelf: 'flex-end', background: 'var(--accent-dim)', padding: '12px', borderRadius: '8px 8px 0 8px', border: '1px solid var(--border-bright)', color: '#fff', fontSize: '13px', maxWidth: '85%' }}>
                                        O autor mencionou alguma tentativa de contato prévio via Procon nos autos?
                                    </div>
                                    <div style={{ alignSelf: 'flex-start', background: 'rgba(74, 158, 127, 0.08)', padding: '12px', borderRadius: '8px 8px 8px 0', border: '1px solid rgba(74, 158, 127, 0.2)', color: '#7acba9', fontSize: '13px', maxWidth: '85%' }}>
                                        Sim. Na página 12 dos anexos iniciais, há um protocolo do Procon datado de 14/01/2025 ("Reclamação CIP Protocolo #2234"), o qual a empresa respondeu dentro do prazo, afirmando a legitimidade do débito. Sugiro incluirmos essa informação na preliminar. <span className="gen-cursor"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* METRICS */}
            <section className="metrics-section" id="metricas">
                <div className="container">
                    <div className="section-label">
                        <div className="section-label-line"></div>
                        <span className="section-label-text">Resultados Mensuráveis</span>
                    </div>
                    <h2 className="section-title">Aumente sua produtividade<br /><em>vertiginosamente</em>.</h2>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-number">95<sup>%</sup></div>
                            <div className="metric-label">Economia de tempo médio descartando triagens manuais de ações genéricas</div>
                            <div className="metric-decoration"><Zap size={80} strokeWidth={1} /></div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-number">∞<sup></sup></div>
                            <div className="metric-label">De defesas geradas sob demanda sem gargalos com a estrutura de importação nativa.</div>
                            <div className="metric-decoration"><Scale size={80} strokeWidth={1} /></div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-number">0<sup></sup></div>
                            <div className="metric-label">Prazos expirados nas operações cíveis graças a consistência operacional imediata.</div>
                            <div className="metric-decoration"><ShieldCheck size={80} strokeWidth={1} /></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trust-section">
                <div className="container">
                    <div className="trust-inner">
                        <div>
                            <blockquote className="trust-quote">
                                O volume de processos repetitivos não é um problema jurídico.
                                É um problema de <em>inteligência de dados</em> &mdash; e agora temos a solução.
                            </blockquote>

                        </div>
                        <div className="trust-right">
                            <div className="trust-item">
                                <div className="trust-icon icon-blue"><Lock size={24} strokeWidth={1.5} /></div>
                                <div className="trust-item-text">
                                    <div className="trust-item-title">Ambiente Seguro</div>
                                    <div className="trust-item-desc">Os dados de clientes e documentos críticos nunca se perdem nem se misturam em fluxos paralelos.</div>
                                </div>
                            </div>
                            <div className="trust-item">
                                <div className="trust-icon icon-gold"><Database size={24} strokeWidth={1.5} /></div>
                                <div className="trust-item-text">
                                    <div className="trust-item-title">Conhecimento Centralizado</div>
                                    <div className="trust-item-desc">A estrutura de geração de respostas utiliza suas próprias defesas, construindo argumentações de acordo com o seu playbook.</div>
                                </div>
                            </div>
                            <div className="trust-item">
                                <div className="trust-icon icon-green"><Zap size={24} strokeWidth={1.5} /></div>
                                <div className="trust-item-text">
                                    <div className="trust-item-title">Implementação Simplificada</div>
                                    <div className="trust-item-desc">Plataforma na nuvem pronta pra utilizar através do ambiente de login imediato SaaS.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* FOOTER */}
            <footer>
                <div className="footer-brand">
                    <img src="/logo_fundo_preto.png" alt="FP Analysis Logo" className="footer-logo-img-small" />
                </div>
                <div className="footer-copy">© {new Date().getFullYear()} FP ANALYSIS &middot; TODOS OS DIREITOS RESERVADOS</div>
            </footer>

        </div>
    );
};

export default Landing;
