-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.6.7-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para mydb
CREATE DATABASE IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `mydb`;

-- Copiando estrutura para tabela mydb.cargos
CREATE TABLE IF NOT EXISTS `cargos` (
  `idCargos` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `cancelado` tinyint(4) DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int(11) DEFAULT NULL,
  PRIMARY KEY (`idCargos`),
  KEY `usuarioAlterou_idx` (`usuarioAlterou`),
  CONSTRAINT `usuarioAlterou_c` FOREIGN KEY (`usuarioAlterou`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.conversas
CREATE TABLE IF NOT EXISTS `conversas` (
  `idConversa` int(11) NOT NULL,
  `idMensagemFixada` varchar(45) DEFAULT NULL,
  `mensagemFixada` int(11) DEFAULT NULL,
  `grupo` int(11) DEFAULT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `nome` varchar(45) NOT NULL,
  `perfil` longblob DEFAULT NULL,
  `dataCriacao` datetime NOT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int(11) DEFAULT NULL,
  `cancelado` int(11) DEFAULT NULL,
  PRIMARY KEY (`idConversa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.conversasfixadas
CREATE TABLE IF NOT EXISTS `conversasfixadas` (
  `idMensagensFixadas` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(11) NOT NULL,
  `idConversa` int(11) NOT NULL,
  `cancelada` int(11) DEFAULT NULL,
  PRIMARY KEY (`idMensagensFixadas`),
  KEY `idUsuario_idx` (`idUsuario`),
  KEY `idConversa_idx` (`idConversa`),
  CONSTRAINT `idConversa_cf` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idUsuario_cf` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.convites
CREATE TABLE IF NOT EXISTS `convites` (
  `idConvites` int(11) NOT NULL AUTO_INCREMENT,
  `idProjeto` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `aceito` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`idConvites`),
  KEY `idProjeto_Conv_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Conv` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.mensagens
CREATE TABLE IF NOT EXISTS `mensagens` (
  `idMensagem` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idConversa` int(11) NOT NULL,
  `horarioEnvio` datetime NOT NULL,
  `texto` text DEFAULT NULL,
  PRIMARY KEY (`idMensagem`),
  KEY `idUsuario_idx` (`idUsuario`),
  KEY `idConversa_idx` (`idConversa`),
  CONSTRAINT `idConversa` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idUsuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.participantes
CREATE TABLE IF NOT EXISTS `participantes` (
  `idParticipantes` int(11) NOT NULL AUTO_INCREMENT,
  `idConversa` int(11) NOT NULL,
  `idParticipante` int(11) NOT NULL,
  `cancelado` int(11) DEFAULT NULL,
  PRIMARY KEY (`idParticipantes`),
  KEY `idConversa_idx` (`idConversa`),
  KEY `idParticipante_idx` (`idParticipante`),
  CONSTRAINT `idConversa_p` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idParticipante` FOREIGN KEY (`idParticipante`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.permissoes
CREATE TABLE IF NOT EXISTS `permissoes` (
  `idPermissoes` int(11) NOT NULL AUTO_INCREMENT,
  `idColaborador` int(11) NOT NULL,
  `idCargo` int(11) DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int(11) DEFAULT NULL,
  PRIMARY KEY (`idPermissoes`),
  KEY `idProjetoColaboradores_idx` (`idColaborador`),
  KEY `idCargo_idx` (`idCargo`),
  KEY `usuarioAlterou_idx` (`usuarioAlterou`),
  CONSTRAINT `idCargo_p` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`idCargos`),
  CONSTRAINT `idProjetoColaborador` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `usuarioAlterou_p` FOREIGN KEY (`usuarioAlterou`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `idPosts` int(11) NOT NULL AUTO_INCREMENT,
  `idTopico` int(11) NOT NULL,
  `idAutor` int(11) NOT NULL,
  `idProjeto` int(11) NOT NULL,
  `descricao` varchar(45) NOT NULL,
  `conteudo` text NOT NULL,
  `dataHora` datetime NOT NULL,
  `cancelado` tinyint(4) DEFAULT NULL,
  `resposta` int(11) DEFAULT NULL,
  PRIMARY KEY (`idPosts`),
  KEY `idAutor_idx` (`idAutor`),
  KEY `idProjeto_idx` (`idProjeto`),
  KEY `idTopico_idx` (`idTopico`),
  CONSTRAINT `idAutor_p` FOREIGN KEY (`idAutor`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idProjeto_p` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idTopico` FOREIGN KEY (`idTopico`) REFERENCES `topicos` (`idTopicos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.projetocolaboradores
CREATE TABLE IF NOT EXISTS `projetocolaboradores` (
  `idProjetoColaborador` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(11) NOT NULL,
  `idProjeto` int(11) NOT NULL,
  `cancelado` int(11) DEFAULT NULL,
  `idCargo` int(11) NOT NULL,
  `dataCriacao` timestamp NULL DEFAULT current_timestamp(),
  `dataAlteracao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idProjetoColaborador`),
  KEY `codigoUsuario_idx` (`idUsuario`),
  KEY `idProjeto_idx` (`idProjeto`),
  KEY `idCargo_idx` (`idCargo`),
  CONSTRAINT `codigoUsuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`),
  CONSTRAINT `idCargo` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`idCargos`),
  CONSTRAINT `idProjeto` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.projetos
CREATE TABLE IF NOT EXISTS `projetos` (
  `idProjetos` int(11) NOT NULL AUTO_INCREMENT,
  `nomeProjeto` varchar(45) NOT NULL,
  `codigoCriador` varchar(45) NOT NULL,
  `descricao` varchar(300) DEFAULT NULL,
  `Cancelado` int(11) DEFAULT NULL,
  `banner` longblob DEFAULT NULL,
  PRIMARY KEY (`idProjetos`),
  UNIQUE KEY `idProjetos_UNIQUE` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.reacoes
CREATE TABLE IF NOT EXISTS `reacoes` (
  `idReacoes` int(11) NOT NULL AUTO_INCREMENT,
  `idMensagem` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `reacao` int(11) DEFAULT NULL,
  `cancelado` int(11) DEFAULT NULL,
  PRIMARY KEY (`idReacoes`),
  KEY `idMensagem_idx` (`idMensagem`),
  KEY `idUsuario_idx` (`idUsuario`),
  CONSTRAINT `idMensagem` FOREIGN KEY (`idMensagem`) REFERENCES `mensagens` (`idMensagem`),
  CONSTRAINT `idUsuario_r` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.sprints
CREATE TABLE IF NOT EXISTS `sprints` (
  `idSprints` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `dataCriacao` datetime NOT NULL,
  `cancelada` tinyint(4) DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `idProjeto` int(11) NOT NULL,
  PRIMARY KEY (`idSprints`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Sp` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.status
CREATE TABLE IF NOT EXISTS `status` (
  `idStatus` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cancelado` tinyint(4) DEFAULT NULL,
  `idProjeto` int(11) NOT NULL,
  PRIMARY KEY (`idStatus`),
  KEY `idProjeto_Sta_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Sta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `idTags` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) NOT NULL,
  `cor` char(7) DEFAULT NULL,
  `prioridade` int(11) NOT NULL,
  `cancelada` tinyint(4) DEFAULT NULL,
  `idProjeto` int(11) NOT NULL,
  PRIMARY KEY (`idTags`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_ta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefas
CREATE TABLE IF NOT EXISTS `tarefas` (
  `idTarefas` int(11) NOT NULL AUTO_INCREMENT,
  `assunto` varchar(45) NOT NULL,
  `prioridade` varchar(6) NOT NULL DEFAULT '',
  `cancelada` tinyint(4) DEFAULT NULL,
  `ultimaResposta` datetime DEFAULT NULL,
  `idAutor` int(11) NOT NULL,
  `idProjeto` int(11) NOT NULL,
  `idStatus` int(11) NOT NULL,
  `idSprint` int(11) DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT current_timestamp(),
  `dataAlteracao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idTarefas`),
  KEY `idAutor_idx` (`idAutor`),
  KEY `idProjeto_idx` (`idProjeto`),
  KEY `idStatus_idx` (`idStatus`),
  KEY `idSprint_idx` (`idSprint`),
  CONSTRAINT `idAutor` FOREIGN KEY (`idAutor`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idProjeto_t` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idSprint` FOREIGN KEY (`idSprint`) REFERENCES `sprints` (`idSprints`),
  CONSTRAINT `idStatus` FOREIGN KEY (`idStatus`) REFERENCES `status` (`idStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefasrespostas
CREATE TABLE IF NOT EXISTS `tarefasrespostas` (
  `idTarefasResposta` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `idTarefa` int(11) NOT NULL,
  `idColaborador` int(11) NOT NULL,
  `statusAnterior` int(11) NOT NULL,
  `statusNovo` int(11) NOT NULL,
  `resposta` text NOT NULL,
  `dataResposta` datetime NOT NULL,
  PRIMARY KEY (`idTarefasResposta`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idColaborador_idx` (`idColaborador`),
  CONSTRAINT `idColaborador_tt` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idTarefa_tt` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefastags
CREATE TABLE IF NOT EXISTS `tarefastags` (
  `idTarefasTags` int(11) NOT NULL AUTO_INCREMENT,
  `idTarefa` int(11) NOT NULL,
  `idTag` int(11) NOT NULL,
  `idProjeto` int(11) NOT NULL,
  PRIMARY KEY (`idTarefasTags`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idTag_ta_idx` (`idTag`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_tta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idTag_ta` FOREIGN KEY (`idTag`) REFERENCES `tags` (`idTags`),
  CONSTRAINT `idTarefa_ta` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefastempo
CREATE TABLE IF NOT EXISTS `tarefastempo` (
  `idTarefasTempo` int(11) NOT NULL AUTO_INCREMENT,
  `idTarefa` int(11) NOT NULL,
  `idColaborador` int(11) NOT NULL,
  `idStatus` int(11) NOT NULL,
  `dataInicio` datetime NOT NULL,
  `dataFinal` datetime DEFAULT NULL,
  PRIMARY KEY (`idTarefasTempo`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idColaborador_idx` (`idColaborador`),
  KEY `idStatus_idx` (`idStatus`),
  CONSTRAINT `idColaborador` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idStatus_t` FOREIGN KEY (`idStatus`) REFERENCES `status` (`idStatus`),
  CONSTRAINT `idTarefa_t` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.topicos
CREATE TABLE IF NOT EXISTS `topicos` (
  `idTopicos` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(70) DEFAULT NULL,
  `cancelado` tinyint(4) DEFAULT NULL,
  `idCriador` int(11) NOT NULL,
  `dataCriacao` timestamp NULL DEFAULT current_timestamp(),
  `dataAlteracao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idTopicos`),
  KEY `idCriador_idx` (`idCriador`),
  CONSTRAINT `idCriador` FOREIGN KEY (`idCriador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nomeUsuario` varchar(60) NOT NULL,
  `dataNascimento` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(60) DEFAULT NULL,
  `cancelado` tinyint(4) DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT current_timestamp(),
  `dataAlteracao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idUsuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
