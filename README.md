# TakeHub

Sistema de gestão de projetos de edição de vídeo: editores organizam projetos e tarefas, e clientes acompanham e aprovam as entregas.

| Parte | Tecnologia | Pasta | Endereço local |
|---|---|---|---|
| Front-end | Angular 21 | `front-app/` | http://localhost:4200 |
| Back-end | Spring Boot 4 (Java 21+) | `backend/` | http://localhost:3000 |
| Banco | PostgreSQL 16 (Docker) | `backend/docker-compose.yml` | localhost:5432 |

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Java 21 ou superior
- Node.js 20 ou superior

O Maven não precisa ser instalado: o projeto usa o wrapper `mvnw`.

## Primeira vez

```powershell
# 1. Com o Docker Desktop aberto: sobe o banco
cd backend
docker compose up -d

# 2. Instala as dependências do front
cd ../front-app
npm install
```

## Rodando no dia a dia

Abra o **Docker Desktop** e espere aparecer "Engine running". O banco sobe sozinho junto com ele. Se você tiver rodado `docker compose down`, o container foi removido e é preciso rodar `docker compose up -d` de novo, dentro de `backend/`.

Depois, em **dois terminais**:

```powershell
# Terminal 1: back-end (espere "Tomcat started on port 3000")
cd backend
.\mvnw.cmd spring-boot:run
```

```powershell
# Terminal 2: front-end
cd front-app
npm start
```

Acesse http://localhost:4200.

Para parar, use `Ctrl + C` em cada terminal. O banco pode continuar ligado.

## Banco de dados

Os dados ficam salvos no volume Docker `backend_takehub-postgres-data` e continuam lá depois de parar o banco, fechar o Docker ou reiniciar o computador.

| Comando (dentro de `backend/`) | O que faz |
|---|---|
| `docker compose up -d` | Sobe o banco |
| `docker compose down` | Para o banco (os dados ficam salvos) |
| `docker compose down -v` | Para o banco e **apaga todos os dados** |
| `docker compose logs -f` | Mostra os logs do Postgres |

As tabelas são criadas automaticamente pelo back-end ao iniciar.

Credenciais de desenvolvimento: banco, usuário e senha são todos `takehub`.

## Problemas comuns

| Erro | Solução |
|---|---|
| `Connection refused` / `localhost:5432` | O banco não está de pé. Abra o Docker Desktop e rode `docker start takehub-postgres` (ou `docker compose up -d` dentro de `backend/`). |
| `Port 3000 was already in use` | Já existe um back-end rodando. Feche o outro terminal ou encerre o processo. |
| Porta 5432 ocupada ao subir o banco | Há outro Postgres na máquina. No `backend/docker-compose.yml`, troque para `"5433:5432"` e rode o back-end com `$env:DB_PORT="5433"` antes do `mvnw`. |
| Front abre, mas tudo dá erro | Confira se o back-end está rodando na porta 3000. |

## Configuração do back-end

Os valores padrão estão em `backend/src/main/resources/application.yml` e podem ser sobrescritos por variáveis de ambiente:

| Variável | Padrão |
|---|---|
| `DB_HOST` / `DB_PORT` / `DB_NAME` | `localhost` / `5432` / `takehub` |
| `DB_USER` / `DB_PASSWORD` | `takehub` / `takehub` |
| `JWT_SECRET` | segredo de desenvolvimento (trocar em produção) |
| `JWT_EXPIRATION_MINUTES` | `120` |
| `CORS_ORIGINS` | `http://localhost:4200` |
