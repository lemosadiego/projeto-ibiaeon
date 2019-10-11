export const createTableConfig = [
'CREATE TABLE IF NOT EXISTS tb_CodigoFicticio (id integer NOT NULL CONSTRAINT tb_CodigoFicticio_pk PRIMARY KEY,'
    +'id_cliente integer,'
    +'id_usuarioEquipamento integer,'
    +'de bigint,'
    +'ate bigint,'
    +'ultimoUtilizado bigint,'
    +'validado boolean,'
    +'id_usuario integer,'
    +'dtAlteracao datetime,'
    +'CONSTRAINT FK_tb_CodigoFicticio_tb_Cliente FOREIGN KEY (id_cliente) REFERENCES tb_Cliente(id))',
'CREATE TABLE IF NOT EXISTS tb_Justificativa (id integer NOT NULL CONSTRAINT tb_Justificativa_pk PRIMARY KEY,'
    +'tempo nvarchar(8),'
    +'id_cliente integer,'
    +'CONSTRAINT FK_tb_Justificativa_tb_Cliente FOREIGN KEY (id_cliente) REFERENCES tb_Cliente(id))',
'CREATE TABLE IF NOT EXISTS tb_ConfiguracoesEquipamento (id integer NOT NULL CONSTRAINT tb_ConfiguracaoEquipamento_pk PRIMARY KEY,'
    +'id_cliente integer NOT NULL,'
    +'nome nvarchar(40) NOT NULL,'
    +'valor nvarchar(255) NOT NULL,'
    +'dtAlteracao datetime,'
    +'CONSTRAINT FK_tb_ConfiguracoesEquipamento_tb_Cliente FOREIGN KEY (id_cliente) REFERENCES tb_Cliente(id))',
'CREATE TABLE IF NOT EXISTS tb_TipoServidor (id integer NOT NULL CONSTRAINT tb_TipoServidor_pk PRIMARY KEY,'
    +'tipoServidor nvarchar(50))',
'CREATE TABLE IF NOT EXISTS tb_Conexao (id integer NOT NULL CONSTRAINT tb_Conexao_pk PRIMARY KEY,'
    +'usuarioConfigId integer,'
    +'status boolean,'
    +'dtInsercao datetime,'
    +'dtAlteracao datetime,'
    +'id_TipoServidor integer,'
    +'banco nvarchar(100),'
    +'servidor nvarchar(255),'
    +'mapeamento nvarchar(255),'
    +'caminhoMapeamento nvarchar(255),'
    +'caminhoFisico nvarchar(255),'
    +'CONSTRAINT FK_tb_Conexao_tb_TipoServidor FOREIGN KEY (id_TipoServidor) REFERENCES tb_TipoServidor(id_TipoServidor))',
'CREATE TABLE IF NOT EXISTS tb_Cliente (id integer NOT NULL CONSTRAINT tb_Cliente_pk PRIMARY KEY,'
    +'cnpj nvarchar(100),'
    +'situacao nvarchar(100),'
    +'status boolean,'
    +'dtInsercao datetime,'
    +'codigo nvarchar(10),'
    +'nome nvarchar(100),'
    +'usuarioConfigId integer,'
    +'dtAlteracao datetime,'
    +'pastaCliente nvarchar(200),'
    +'smtp nvarchar(100),'
    +'emailRecebimento nvarchar(100),'
    +'emailEnvio nvarchar(100),'
    +'senhaEmailEnvio nvarchar(255),'
    +'id_conexao integer,'
    +'banco nvarchar(100),'
    +'CONSTRAINT FK_tb_Cliente_tb_Conexao FOREIGN KEY (id_conexao) REFERENCES tb_Conexao(id))',
'CREATE TABLE IF NOT EXISTS tb_UsuarioEquipamento (id integer NOT NULL CONSTRAINT tb_UsuarioEquipamento_pk PRIMARY KEY,'
    +'nome nvarchar(50),'
    +'login nvarchar(50),'
    +'senha nvarchar(50),'
    +'tipo nvarchar(50),'
    +'status boolean,'
    +'dtInsercao datetime,'
    +'dtAlteracao datetime,'
    +'usuarioConfigID integer,'
    +'usuarioPdaID integer)',
'CREATE TABLE IF NOT EXISTS tb_ControleSyncIn (id integer NOT NULL CONSTRAINT tb_ControleSyncIn_pk PRIMARY KEY,'
    +'tb_UsuarioEquipamento datetime,'
    +'tb_CodigoFicticio datetime,'
    +'tb_Justificativa datetime,'
    +'tb_ConfiguracoesEquipamento datetime,'
    +'tb_TipoServidor datetime,'
    +'tb_Conexao datetime,'
    +'tb_Cliente datetime,'
    +'tb_ControleExclusao)'
];


export const tb_CodigoFicticio = 'tb_CodigoFicticio';
export const tb_Justificativa = 'tb_Justificativa';
export const tb_ConfiguracoesEquipamento = 'tb_ConfiguracoesEquipamento';
export const tb_TipoServidor = 'tb_TipoServidor';
export const tb_Conexao = 'tb_Conexao';
export const tb_Cliente = 'tb_Cliente';
export const tb_UsuarioEquipamento = 'tb_UsuarioEquipamento';


export const tabelas = ['tb_UsuarioEquipamento', 'tb_CodigoFicticio', 'tb_ConfiguracoesEquipamento','tb_Conexao','tb_Cliente'];
export const qtdLinhas = 10000;