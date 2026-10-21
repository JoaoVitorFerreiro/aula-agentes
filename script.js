const chaveArmazenamento = 'oficina-agentes-progresso-v1';
const totalEtapas = 7;
const paineis = [...document.querySelectorAll('[data-panel]')];
const linksEtapas = [...document.querySelectorAll('.step-link')];
const caixas = [...document.querySelectorAll('[data-check]')];
let estado = carregarEstado();
let etapaAtual = Math.min(Math.max(estado.etapa || 0, 0), totalEtapas - 1);
let temporizadorToast;

// Recupera o progresso salvo sem impedir a aula caso o navegador bloqueie o armazenamento.
function carregarEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(chaveArmazenamento));
    if (!salvo || typeof salvo !== 'object') return { etapa: 0, marcacoes: {} };
    return {
      etapa: Number.isInteger(salvo.etapa) ? salvo.etapa : 0,
      marcacoes: salvo.marcacoes && typeof salvo.marcacoes === 'object' ? salvo.marcacoes : {},
    };
  } catch {
    return { etapa: 0, marcacoes: {} };
  }
}

// Persiste a etapa atual e as marcações de checklist neste navegador.
function salvarEstado() {
  try {
    localStorage.setItem(chaveArmazenamento, JSON.stringify(estado));
    document.querySelector('#save-status').textContent = 'PROGRESSO SALVO AUTOMATICAMENTE';
  } catch {
    document.querySelector('#save-status').textContent = 'PROGRESSO SÓ NESTA SESSÃO';
  }
}

// Atualiza a etapa em foco, o conteúdo e os indicadores de progresso.
function mostrarEtapa(indice, rolar = false) {
  etapaAtual = Math.min(Math.max(indice, 0), totalEtapas - 1);
  estado.etapa = etapaAtual;
  paineis.forEach((painel, i) => {
    const visivel = i === etapaAtual;
    painel.hidden = !visivel;
    painel.classList.toggle('is-visible', visivel);
  });
  linksEtapas.forEach((link, i) => {
    link.classList.toggle('is-active', i === etapaAtual);
    link.classList.toggle('is-complete', etapaConcluida(i));
    if (i === etapaAtual) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('#progress-label').textContent = `${etapasConcluidas()} / ${totalEtapas}`;
  document.querySelector('#progress-bar').style.width = `${(etapasConcluidas() / totalEtapas) * 100}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', etapasConcluidas());
  document.querySelector('#lesson-kicker').textContent = ['PREPARAÇÃO', 'INSTALAÇÃO', 'ARQUIVOS DO KIT', 'CONFIGURAÇÃO', 'AUTENTICAÇÃO', 'PRIMEIRO TESTE', 'MÃO NA MASSA'][etapaAtual];
  document.querySelector('#lesson-time').textContent = ['02 MIN', '03 MIN', '03 MIN', '02 MIN', '02 MIN', '03 MIN', '08 MIN'][etapaAtual];
  document.querySelector('#previous-button').disabled = etapaAtual === 0;
  document.querySelector('#next-button').innerHTML = etapaAtual === totalEtapas - 1 ? 'Finalizar oficina <span aria-hidden="true">✳</span>' : 'Próxima etapa <span aria-hidden="true">→</span>';
  salvarEstado();
  if (rolar) document.querySelector('#oficina').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Informa se todas as tarefas obrigatórias daquela etapa estão marcadas.
function etapaConcluida(indice) {
  const tarefasObrigatorias = [...document.querySelectorAll(`[data-checklist="${indice}"] [data-check]`)];
  return tarefasObrigatorias.length > 0 && tarefasObrigatorias.every((caixa) => estado.marcacoes[caixa.dataset.check]);
}

// Conta quantas etapas obrigatórias já foram concluídas.
function etapasConcluidas() {
  return Array.from({ length: totalEtapas }, (_, i) => i).filter(etapaConcluida).length;
}

// Copia um trecho e mostra um aviso; oferece alternativa para navegadores sem Clipboard API.
async function copiarTexto(texto, botao) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.append(campo);
    campo.select();
    document.execCommand('copy');
    campo.remove();
  }
  const rotulo = botao.querySelector('span');
  if (rotulo) {
    const original = rotulo.textContent;
    rotulo.textContent = 'Copiado!';
    window.setTimeout(() => { rotulo.textContent = original; }, 1400);
  }
  const toast = document.querySelector('#toast');
  toast.classList.add('is-shown');
  window.clearTimeout(temporizadorToast);
  temporizadorToast = window.setTimeout(() => toast.classList.remove('is-shown'), 1900);
}

caixas.forEach((caixa) => {
  caixa.checked = Boolean(estado.marcacoes[caixa.dataset.check]);
  caixa.addEventListener('change', () => {
    estado.marcacoes[caixa.dataset.check] = caixa.checked;
    linksEtapas.forEach((link, i) => { link.classList.toggle('is-complete', etapaConcluida(i)); });
    document.querySelector('#progress-label').textContent = `${etapasConcluidas()} / ${totalEtapas}`;
    document.querySelector('#progress-bar').style.width = `${(etapasConcluidas() / totalEtapas) * 100}%`;
    document.querySelector('.progress-track').setAttribute('aria-valuenow', etapasConcluidas());
    salvarEstado();
  });
});

linksEtapas.forEach((link) => { link.addEventListener('click', () => mostrarEtapa(Number(link.dataset.step))); });
document.querySelector('#previous-button').addEventListener('click', () => mostrarEtapa(etapaAtual - 1));
document.querySelector('#next-button').addEventListener('click', () => {
  if (etapaAtual < totalEtapas - 1) mostrarEtapa(etapaAtual + 1);
  else document.querySelector('#oficina').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('#start-button').addEventListener('click', () => mostrarEtapa(etapaAtual, true));
document.querySelector('#reset-progress').addEventListener('click', () => {
  if (!window.confirm('Apagar todas as marcações e recomeçar a oficina?')) return;
  estado = { etapa: 0, marcacoes: {} };
  caixas.forEach((caixa) => { caixa.checked = false; });
  mostrarEtapa(0, true);
});
document.querySelectorAll('[data-copy]').forEach((botao) => {
  botao.addEventListener('click', () => copiarTexto(botao.dataset.copy, botao));
});

mostrarEtapa(etapaAtual);
