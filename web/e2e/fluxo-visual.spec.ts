import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8080';
const PASTA_CAPTURAS = 'artifacts/browser';

mkdirSync(PASTA_CAPTURAS, { recursive: true });

async function aguardarInterface(page: Page) {
  await page.waitForTimeout(450);
}

async function aguardarToasts(page: Page) {
  await expect(page.locator('[data-sonner-toast]')).toHaveCount(0, { timeout: 7000 });
}

test.use({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'light',
});

test('fluxo principal e telas do Mini Kanban', async ({ page }) => {
  const errosDoNavegador: string[] = [];

  page.on('pageerror', (erro) => errosDoNavegador.push(`pageerror: ${erro.message}`));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') {
      errosDoNavegador.push(`console: ${mensagem.text()}`);
    }
  });

  const email = `navegador-ci-${Date.now()}@example.com`;
  const senha = 'senha123';

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Mini Kanban' })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/01-login.png`, fullPage: true });

  await page.getByRole('button', { name: 'Não tem uma conta? Cadastre-se' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole('button', { name: 'Criar conta' })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/02-cadastro.png`, fullPage: true });

  await page.getByLabel('Nome').fill('Navegador CI');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill(senha);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill(senha);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/app$/);

  await expect(page.getByRole('heading', { name: 'A Fazer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Em Andamento' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Concluído' })).toBeVisible();
  await aguardarToasts(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/03-quadro-vazio.png`, fullPage: true });

  const colunaAFazer = page.getByTestId('kanban-column-TODO');
  await colunaAFazer.getByRole('button', { name: 'Adicionar tarefa' }).click();

  let modal = page.getByRole('dialog');
  await expect(modal.getByRole('heading', { name: 'Nova Tarefa' })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/04-modal-nova-tarefa.png`, fullPage: true });

  await modal.getByPlaceholder('Digite o título da tarefa').fill('Tarefa navegador CI');
  await modal.getByPlaceholder('Adicione observações, checklist ou detalhes desta tarefa (opcional)').fill('Criada pelo teste visual do navegador.');
  await modal.locator('select').nth(1).selectOption('Alta');
  await modal.getByPlaceholder('Ex: Urgente, Estudo, Design').fill('e2e');
  await modal.getByRole('button', { name: 'Adicionar', exact: true }).first().click();
  await modal.getByRole('button', { name: 'Criar' }).click();

  await expect(colunaAFazer.getByText('Tarefa navegador CI', { exact: true })).toBeVisible();
  await aguardarToasts(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/05-quadro-com-tarefa.png`, fullPage: true });

  await colunaAFazer.getByText('Tarefa navegador CI', { exact: true }).click();
  modal = page.getByRole('dialog');
  await expect(modal.getByRole('heading', { name: 'Editar Tarefa' })).toBeVisible();

  await modal.getByPlaceholder('Escreva um comentário...').fill('Comentário criado pelo navegador');
  await modal.getByRole('button', { name: 'Enviar comentário' }).click();
  await expect(modal.getByText('Comentário criado pelo navegador', { exact: true })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/06-modal-edicao-com-comentario.png`, fullPage: true });

  await modal.locator('select').first().selectOption('DOING');
  await modal.getByRole('button', { name: 'Salvar' }).click();

  const colunaEmAndamento = page.getByTestId('kanban-column-DOING');
  await expect(colunaEmAndamento.getByText('Tarefa navegador CI', { exact: true })).toBeVisible();
  await aguardarToasts(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/07-tarefa-em-andamento.png`, fullPage: true });

  const cartaoArrastavel = colunaEmAndamento
    .locator('[data-rfd-draggable-id]')
    .filter({ hasText: 'Tarefa navegador CI' });
  await expect(cartaoArrastavel).toBeVisible();
  await cartaoArrastavel.focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');

  const colunaConcluido = page.getByTestId('kanban-column-DONE');
  await expect(colunaConcluido.getByText('Tarefa navegador CI', { exact: true })).toBeVisible();
  await aguardarToasts(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/08-drag-and-drop-concluido.png`, fullPage: true });

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('button', { name: 'Configurações' }).click();
  await expect(page).toHaveURL(/\/app\/settings$/);
  await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible();
  await aguardarInterface(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/09-configuracoes-claro.png`, fullPage: true });

  await page.getByRole('button').filter({ hasText: 'Escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await aguardarInterface(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/10-configuracoes-escuro.png`, fullPage: true });

  await page.getByLabel('Nome completo').fill('Navegador CI Atualizado');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByLabel('Nome completo')).toHaveValue('Navegador CI Atualizado');

  const toastPerfilAtualizado = page.getByText('Perfil atualizado com sucesso!');
  await expect(toastPerfilAtualizado).toBeVisible();
  await expect(toastPerfilAtualizado).toBeHidden({ timeout: 8000 });

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Mini Kanban' })).toBeVisible();

  await page.getByRole('link', { name: 'Esqueceu sua senha?' }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.getByRole('heading', { name: 'Recuperar Senha' })).toBeVisible();
  await aguardarInterface(page);
  await page.screenshot({ path: `${PASTA_CAPTURAS}/11-esqueci-senha.png`, fullPage: true });

  await page.getByLabel('E-mail').fill(email);
  await page.getByRole('button', { name: 'Enviar Link de Redefinição' }).click();
  await expect(page.getByRole('heading', { name: 'Verifique seu E-mail' })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/12-confirmacao-recuperacao.png`, fullPage: true });

  await page.goto(`${BASE_URL}/reset-password?token=token-de-validacao`, { waitUntil: 'networkidle' });
  await expect(page).toHaveURL(/\/reset-password\?token=token-de-validacao$/);
  await expect(page.getByRole('heading', { name: 'Nova Senha' })).toBeVisible();
  await page.screenshot({ path: `${PASTA_CAPTURAS}/13-redefinir-senha.png`, fullPage: true });

  expect(errosDoNavegador, errosDoNavegador.join('\n')).toEqual([]);
});
