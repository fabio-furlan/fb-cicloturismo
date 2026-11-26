-- Página "Sobre nós", editada pelo ADM. Existe uma só (id = 1); enquanto não houver linha, o site mostra o texto padrão.
create table pagina_sobre (
    id            bigint       primary key check (id = 1),
    titulo        varchar(120) not null,
    chamada       varchar(500) not null,
    -- Uma linha em branco separa os parágrafos.
    historia      text         not null,
    citacao       varchar(300),
    atualizado_em timestamptz  not null default now()
);

-- Linha do tempo, na ordem em que aparece.
create table pagina_sobre_marco (
    id        bigint generated always as identity primary key,
    pagina_id bigint       not null references pagina_sobre (id) on delete cascade,
    rotulo    varchar(40)  not null,
    titulo    varchar(120) not null,
    texto     varchar(600) not null,
    ordem     integer      not null default 0
);

create table pagina_sobre_foto (
    id        bigint generated always as identity primary key,
    pagina_id bigint       not null references pagina_sobre (id) on delete cascade,
    url       varchar(500) not null,
    -- Texto alternativo, para leitores de tela.
    descricao varchar(255) not null,
    legenda   varchar(160),
    ordem     integer      not null default 0
);

create index ix_pagina_sobre_marco_pagina on pagina_sobre_marco (pagina_id, ordem);
create index ix_pagina_sobre_foto_pagina on pagina_sobre_foto (pagina_id, ordem);
