# ⚡ Calculadora de Carregamento Elétrico

Aplicação web para calcular alcance, custo e tempo de carregamento de veículos elétricos.

**🌐 [Abrir aplicação](https://thecarrulo.github.io/chargingApp/)**

---

## Funcionalidades

### Alcance
- Calcula o alcance estimado com base na capacidade da bateria e consumo (kWh/100km)

### Custo de Carregamento
- Calcula o custo total com base na energia carregada (kWh) e preço por kWh (€)

### Tempo para Carregar
- Calcula a energia necessária entre duas percentagens de bateria
- Calcula o tempo de carregamento com base na velocidade do carregador (kW)
- Resultado em horas e minutos

### Outras funcionalidades
- Histórico por secção (regista ao sair de cada campo)
- Curva de carregamento interativa (BMW i5 eDrive40)
- Todas as secções são recolhíveis
- Cálculos em tempo real

---

## Utilização

Basta abrir o ficheiro `index.html` num browser — não requer servidor nem instalação.

---

## Tecnologias

- HTML + CSS + JavaScript (vanilla)
- [Chart.js](https://www.chartjs.org/) para o gráfico da curva de carregamento
