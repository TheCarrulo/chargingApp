# ⚡ Calculadora de Carregamento Elétrico

Aplicação web para calcular alcance, custo e tempo de carregamento de veículos elétricos, com calculadora de IVA, previsão de autonomia e estimativa de km de contrato.

**🌐 [Abrir aplicação](https://charging.carrulo.pt/)**

---

## Funcionalidades

### Alcance
- Calcula o alcance estimado com base na capacidade da bateria e consumo (kWh/100km)

### Custo de Carregamento
- Calcula o custo total com base na energia carregada (kWh) e preço por kWh (€)

### Tempo para Carregar
- Calcula a energia necessária entre duas percentagens de bateria
- Velocidade de carregamento introduzida em **kW** ou **Amperes**
  - Em modo kW mostra o equivalente em A (calculado a 230V)
  - Em modo A mostra o equivalente em kW, com campo de tensão (230V monofásico / 400V trifásico)
- Resultado em horas e minutos com hora estimada de conclusão (ex: `9h 39min / 02/04 15:00`)

### Previsão Autonomia
- Indica os km estimados a uma percentagem alvo com base na percentagem e km atuais
- Fórmula: `km alvo = km atuais ÷ % atual × % alvo`
- Histórico de cálculos e botão Reset (100% alvo por defeito)

### Calcular IVA
- Cálculo bidirecional: preenche **valor sem IVA** → calcula valor com IVA; preenche **valor com IVA** → calcula valor sem IVA
- Taxa de IVA configurável (23% por defeito)
- Mostra o valor do IVA isolado

### Estimativa Km do Contrato
- Calcula o ritmo mensal atual e o ritmo contratual (limite ÷ total de meses)
- Mostra meses decorridos / restantes / total
- Projeta os km estimados no final do contrato
- Indicador visual verde / amarelo / vermelho consoante a projeção vs limite
- Valores por defeito configuráveis com botão Reset

### Outras funcionalidades
- Histórico por secção (regista ao sair de cada campo)
- Botões Limpar e Reset individuais em cada secção
- Curva de carregamento interativa com tooltip ao passar o rato (BMW i5 eDrive40)
- Todas as secções são recolhíveis
- Cálculos em tempo real
- Changelog acessível ao clicar na versão (rodapé)

---

## Utilização

Basta abrir o ficheiro `index.html` num browser — não requer servidor nem instalação.

---

## Tecnologias

- HTML + CSS + JavaScript (vanilla)
- [Chart.js](https://www.chartjs.org/) para o gráfico da curva de carregamento
