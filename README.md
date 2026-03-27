# ⚡ Calculadora de Carregamento Elétrico

Aplicação web para calcular alcance, custo e tempo de carregamento de veículos elétricos, com calculadora de IVA incluída.

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
- Resultado em horas e minutos

### Calcular IVA
- Cálculo bidirecional: preenche **valor sem IVA** → calcula valor com IVA; preenche **valor com IVA** → calcula valor sem IVA
- Taxa de IVA configurável (23% por defeito)
- Mostra o valor do IVA isolado

### Outras funcionalidades
- Histórico por secção (regista ao sair de cada campo)
- Botão "Limpar campos" individual em cada secção
- Curva de carregamento interativa com tooltip ao passar o rato (BMW i5 eDrive40)
- Todas as secções são recolhíveis
- Cálculos em tempo real

---

## Utilização

Basta abrir o ficheiro `index.html` num browser — não requer servidor nem instalação.

---

## Tecnologias

- HTML + CSS + JavaScript (vanilla)
- [Chart.js](https://www.chartjs.org/) para o gráfico da curva de carregamento
