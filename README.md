# Haia

Haia é um projeto open source para gestão de projetos baseada em tarefas. Suas funcionalidades foram pensadas para dar suporte a modelos ágeis de gerenciamento. Sendo meu Projeto de Finalização de Curso (PFC) no IFPR, no curso de técnico em informática integrado ao ensino médio, seu desenvolvimento teve início em 2021.

# Instalação e configuração

O Haia tem seu desenvolvimento baseado em Node.js, de maneira que para poder utilizar a plataforma é necessário que o ambiente esteja previamente configurado com esse software. [Download Node.js.](https://nodejs.org/en/download/)

Para hospedar o banco de dados será necessário configurar um servidor MySQL, o arquivo que trata sobre a comunicação com o banco de dados é o database.js, localizado em: [server/config/database.js](https://github.com/Buligon/Haia/blob/7af354ef4cab4aa486b9a545d3009750da20e883/server/config/database.js). Os arquivos relacionados ao banco de dados (diagramas, dicionário, backups, etc) se encontram na [pasta database](https://github.com/Buligon/Haia/tree/main/database), com eles é possível encontrar pronta a estrutura para usar a plataforma.

Após finalizar a configuração é necessário executar com o Node o arquivo index.js, o qual está presente em: [server/index.js](https://github.com/Buligon/Haia/blob/7af354ef4cab4aa486b9a545d3009750da20e883/server/index.js). Esse arquivo é responsável por unir todas as rotas e informações do projeto.

Obs.: A plataforma foi desenvolvida para precisar de o mímino de alterações possíveis para rodar em outras máquinas, entretanto o envio de emails necessita ser configurado novamente para que funcione, pois depende de um domínio próprio.

Essa configuração pode ser realizada em: 
- [server/config/email.js](https://github.com/Buligon/Haia/blob/7af354ef4cab4aa486b9a545d3009750da20e883/server/config/email.js), e
- Na rota /convidaColaborador/:codProjeto, presente no arquivo projetoConfig.js em: [server/routes/projetoConfig.js](https://github.com/Buligon/Haia/blob/7af354ef4cab4aa486b9a545d3009750da20e883/server/routes/projetoConfig.js)

# Precisa de ajuda?

Caso seja necessário ajuda, por favor, abra um issue no diretório ou entre em contato comigo pelo email lukasbuligonantunes@gmail.com.