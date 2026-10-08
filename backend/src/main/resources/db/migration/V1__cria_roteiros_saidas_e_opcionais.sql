-- Roteiro é o produto (o percurso e sua descrição). Saída é uma edição vendável do roteiro, com datas, vagas e preço.
-- Opcional é um acréscimo contratável em uma saída específica (quarto individual, aluguel de bike, transfer).

create table roteiro (
    id             bigint generated always as identity primary key,
    slug           varchar(80)  not null unique,
    titulo         varchar(120) not null,
    regiao         varchar(160) not null,
    descricao      text         not null,
    modalidade     varchar(20)  not null check (modalidade in ('MTB', 'SPEED', 'GRAVEL', 'MISTA')),
    destino        varchar(20)  not null check (destino in ('NACIONAL', 'INTERNACIONAL')),
    nivel          varchar(20)  not null check (nivel in ('RECREATIVO', 'INTERMEDIARIO', 'AVANCADO')),
    paisagem       varchar(20)  not null check (paisagem in ('SERRA', 'VALE', 'FE')),
    -- Duração total da viagem, incluindo dias sem pedal (traslado, chegada).
    dias           integer      not null check (dias > 0),
    distancia_km   numeric(6, 1) not null check (distancia_km >= 0),
    subida_total_m integer      not null check (subida_total_m >= 0),
    -- Perfil altimétrico: altitudes em metros, amostradas em intervalos iguais do início ao fim do percurso.
    altitudes      integer[]    not null default '{}',
    criado_em      timestamptz  not null default now(),
    atualizado_em  timestamptz  not null default now()
);

-- Um dia de pedal. Dias sem pedal não têm etapa.
create table roteiro_etapa (
    id           bigint generated always as identity primary key,
    roteiro_id   bigint        not null references roteiro (id) on delete cascade,
    dia          integer       not null check (dia > 0),
    titulo       varchar(160)  not null,
    distancia_km numeric(6, 1) not null check (distancia_km >= 0),
    subida_m     integer check (subida_m >= 0),
    unique (roteiro_id, dia)
);

create table roteiro_imagem (
    id         bigint generated always as identity primary key,
    roteiro_id bigint       not null references roteiro (id) on delete cascade,
    tipo       varchar(20)  not null check (tipo in ('BANNER', 'GALERIA')),
    url        varchar(500) not null,
    -- Texto alternativo, para leitores de tela.
    descricao  varchar(255) not null,
    -- Crédito e origem, para controle das licenças.
    autor      varchar(120),
    origem     varchar(500),
    ordem      integer      not null default 0
);

create index ix_roteiro_imagem_roteiro on roteiro_imagem (roteiro_id, ordem);
create unique index ux_roteiro_imagem_um_banner on roteiro_imagem (roteiro_id) where tipo = 'BANNER';

-- Só a situação editorial é gravada. O status exibido no dashboard (aberta, esgotada, inscrições encerradas,
-- em andamento, finalizada) é calculado a partir das datas e das vagas.
create table saida (
    id               bigint generated always as identity primary key,
    roteiro_id       bigint         not null references roteiro (id),
    data_inicio      date           not null,
    data_fim         date           not null,
    inscricoes_ate   date           not null,
    capacidade       integer        not null check (capacidade > 0),
    vagas_ocupadas   integer        not null default 0,
    preco_base       numeric(10, 2) not null check (preco_base >= 0),
    situacao         varchar(20)    not null default 'RASCUNHO'
        check (situacao in ('RASCUNHO', 'PUBLICADA', 'CANCELADA')),
    -- Controle de concorrência otimista (@Version) na reserva de vagas.
    versao           bigint         not null default 0,
    criado_em        timestamptz    not null default now(),
    atualizado_em    timestamptz    not null default now(),
    check (data_fim >= data_inicio),
    check (inscricoes_ate <= data_inicio),
    check (vagas_ocupadas between 0 and capacidade)
);

create index ix_saida_roteiro on saida (roteiro_id, data_inicio);
create index ix_saida_data_inicio on saida (data_inicio);

-- Se o participante escolhe uma ou várias opções do mesmo grupo é regra do grupo (no domínio): em ACOMODACAO a
-- escolha é única; em EQUIPAMENTO e SERVICO, as opções se somam.
create table opcional (
    id         bigint generated always as identity primary key,
    saida_id   bigint         not null references saida (id) on delete cascade,
    grupo      varchar(20)    not null check (grupo in ('ACOMODACAO', 'EQUIPAMENTO', 'SERVICO')),
    nome       varchar(120)   not null,
    descricao  varchar(255),
    acrescimo  numeric(10, 2) not null check (acrescimo >= 0),
    ordem      integer        not null default 0,
    unique (saida_id, grupo, nome)
);
