export const insertTbMarca = 'insert into tb_Marca (id,'
                                    +'codigo,'
                                    +'dsMarca,'
                                    +'origem,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioLogin,'
                                    +'deleted)';
export const insertTbPatrimonio = 'insert into tb_Patrimonio (id,'
                                    +'id_Filial,'
                                    +'id_Especie,'
                                    +'id_Condicao,'
                                    +'id_Responsavel,'
                                    +'id_CentroCusto,'
                                    +'id_Local,'
                                    +'codigo,'
                                    +'codigoAnterior,'
                                    +'incorporacao,'
                                    +'incorporacaoAnterior,'
                                    +'descricao,'
                                    +'serie,'
                                    +'observacao,'
                                    +'tag,'
                                    +'AUX1,'
                                    +'AUX2,'
                                    +'AUX3,'
                                    +'AUX4,'
                                    +'AUX5,'
                                    +'AUX6,'
                                    +'AUX7,'
                                    +'AUX8,'
                                    +'status,'
                                    +'latitude,'
                                    +'longitude,'
                                    +'altitude,'
                                    +'seq,'
                                    +'gravado,'
                                    +'numeroFicticio,'
                                    +'id_linkEspecieMarca,'
                                    +'id_linkEspecieMarcaModelo,'
                                    +'marca,'
                                    +'modelo,'
                                    +'dtAlteracao,'
                                    +'ultimoUsuario)';
export const insertTbInventario = 'insert into tb_Inventario (id,'
                                    +'id_Patrimonio,'
                                    +'dtInsercao,'
                                    +'situacao,'
                                    +'usuarioPdaLogin,'
                                    +'usuarioConfigLogin)';
export const insertTbCentroCusto = 'insert into tb_CentroCusto(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbCentroResponsabilidade = 'insert into tb_CentroResponsabilidade(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbLocal = 'insert into tb_Local(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbFilial = 'insert into tb_Filial(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbCondicaoUso = 'insert into tb_CondicaoUso(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbGrupo = 'insert into tb_Grupo(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin)';
export const insertTbPropriedade = 'insert into tb_Propriedade(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin,'
                                    +'id_tipoDado,'
                                    +'padronizacao)';
export const insertTbEspecie = 'insert into tb_Especie(id,'
                                    +'codigo,' 
                                    +'nome,'
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigLogin,'
                                    +'usuarioPdaLogin,'
                                    +'id_grupo,'
                                    +'codContaContabil,'
                                    +'vidaUtil)';
export const insertTbDicionarioEspecie = 'insert into tb_DicionarioEspecie(id,'
                                    +'id_grupo,' 
                                    +'id_propriedade,'
                                    +'temp,'
                                    +'retirar)';
export const insertTbCodigoFicticio = 'insert into tb_CodigoFicticio(id,'
                                    +'id_cliente,' 
                                    +'id_usuarioEquipamento,'
                                    +'de,'
                                    +'ate,'
                                    +'ultimoUtilizado,'
                                    +'validado)';
export const insertTbCodigoJustificativa = 'insert into tb_Justificativa(id,'
                                    +'tempo,'
                                    +'id_cliente)';
export const insertTbConfiguracoesEquipamento = 'insert into tb_ConfiguracoesEquipamento(id,'
                                    +'id_cliente,' 
                                    +'nome,'
                                    +'valor)';
export const insertTbTipoServidor = 'insert into tb_TipoServidor(id,'
                                    +'tipoServidor)';
export const insertTbConexao = 'insert into tb_Conexao(id,'
                                    +'usuarioConfigId,' 
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'id_TipoServidor,'
                                    +'banco,'
                                    +'servidor,'
                                    +'mapeamento,'
                                    +'caminhoMapeamento,'
                                    +'caminhoFisico)';
export const insertTbCliente = 'insert into tb_Cliente(id,'
                                    +'cnpj,' 
                                    +'situacao,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'codigo,'
                                    +'nome,'
                                    +'usuarioConfigId,'
                                    +'dtAlteracao,'
                                    +'pastaCliente,'
                                    +'smtp,'
                                    +'emailRecebimento,'
                                    +'emailEnvio,'
                                    +'senhaEmailEnvio,'
                                    +'id_conexao,'
                                    +'banco)';
export const insertTbAtributosDoBem = 'insert into tb_AtributosDoBem(id,'
                                    +'id_patrimonio,' 
                                    +'id_propriedade,'
                                    +'texto)';
export const insertTbInventarioMovimentacoes = 'insert into tb_InventarioMovimentacoes(id,'
                                    +'id_inventario,' 
                                    +'id_propriedade,'
                                    +'valorAntigo,'
                                    +'valorNovo)';
export const insertTbPropriedadeLookUp = 'insert into tb_PropriedadeLookUp(id,'
                                    +'id_propriedade,' 
                                    +'valor,'
                                    +'situacao,'
                                    +'dtInsercao,'
                                    +'usuarioConfigLogin,'
                                    +'retirar,'
                                    +'temp)';
export const insertTbTipoDado = 'insert into tb_TipoDado(id,'
                                    +'nome)';
export const insertTbUsuarioEquipamento = 'insert into tb_UsuarioEquipamento(id,'
                                    +'nome,' 
                                    +'login,'
                                    +'senha,'
                                    +'tipo,'
                                    +'status,'
                                    +'dtInsercao,'
                                    +'dtAlteracao,'
                                    +'usuarioConfigID,'
                                    +'usuarioPdaID)';
export const insertTbTipoDadosPatrimonio = 'insert into tb_TipoDadosPatrimonio(id,'
                                    +'codigo,'
                                    +'descricao)';
export const insertTbFotoDoBem = 'insert into tb_FotoDoBem(codigoFilial,'
                                    +'codigoPatrimonio,'
                                    +'incorporacao,'
                                    +'nomeFoto,'
                                    +'dtInsercao,'
                                    +'syncToServer)'    

export const local = 'local'
export const cCusto ='cCusto';
export const condicao = 'condicao';
export const responsavel ='responsavel';
export const descricao ='descricao';
export const marca ='marca';
export const modelo ='modelo';
export const serie ='serie';
export const codAnterior ='codAnterior';
export const tag  = 'tag';
export const aux1 = 'aux1';
export const aux2 = 'aux2';
export const aux3 = 'aux3';
export const aux4 = 'aux4';
export const aux5 = 'aux5';
export const aux6 = 'aux6';
export const aux7 = 'aux7';
export const aux8 = 'aux8';
export const observacao = 'observacao';
export const coordenada = 'coordenada';