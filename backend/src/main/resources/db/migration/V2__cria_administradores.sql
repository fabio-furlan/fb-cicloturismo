-- Quem opera o painel do ADM. A senha é guardada só como hash (BCrypt, com o prefixo {bcrypt} do Spring Security).
create table administrador (
    id            bigint generated always as identity primary key,
    email         varchar(160) not null,
    nome          varchar(120) not null,
    senha_hash    varchar(100) not null,
    ativo         boolean      not null default true,
    criado_em     timestamptz  not null default now(),
    atualizado_em timestamptz  not null default now()
);

-- O e-mail é o login: único sem diferenciar maiúsculas.
create unique index ux_administrador_email on administrador (lower(email));
