-- Nova paisagem: Litoral & Praias.
alter table roteiro drop constraint roteiro_paisagem_check;
alter table roteiro add constraint roteiro_paisagem_check check (paisagem in ('SERRA', 'VALE', 'FE', 'LITORAL'));
