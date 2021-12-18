-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.0.27 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para mydb
DROP DATABASE IF EXISTS `mydb`;
CREATE DATABASE IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mydb`;

-- Copiando estrutura para tabela mydb.cargos
DROP TABLE IF EXISTS `cargos`;
CREATE TABLE IF NOT EXISTS `cargos` (
  `idCargos` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `Cargoscol` varchar(45) DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int DEFAULT NULL,
  PRIMARY KEY (`idCargos`),
  KEY `usuarioAlterou_idx` (`usuarioAlterou`),
  CONSTRAINT `usuarioAlterou_c` FOREIGN KEY (`usuarioAlterou`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.conversas
DROP TABLE IF EXISTS `conversas`;
CREATE TABLE IF NOT EXISTS `conversas` (
  `idConversa` int NOT NULL,
  `idMensagemFixada` varchar(45) DEFAULT NULL,
  `mensagemFixada` int DEFAULT NULL,
  `grupo` int DEFAULT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `nome` varchar(45) NOT NULL,
  `perfil` longblob,
  `dataCriacao` datetime NOT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int DEFAULT NULL,
  `cancelado` int DEFAULT NULL,
  PRIMARY KEY (`idConversa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.conversasfixadas
DROP TABLE IF EXISTS `conversasfixadas`;
CREATE TABLE IF NOT EXISTS `conversasfixadas` (
  `idMensagensFixadas` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idConversa` int NOT NULL,
  `cancelada` int DEFAULT NULL,
  PRIMARY KEY (`idMensagensFixadas`),
  KEY `idUsuario_idx` (`idUsuario`),
  KEY `idConversa_idx` (`idConversa`),
  CONSTRAINT `idConversa_cf` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idUsuario_cf` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.mensagens
DROP TABLE IF EXISTS `mensagens`;
CREATE TABLE IF NOT EXISTS `mensagens` (
  `idMensagem` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idConversa` int NOT NULL,
  `horarioEnvio` datetime NOT NULL,
  `texto` text,
  PRIMARY KEY (`idMensagem`),
  KEY `idUsuario_idx` (`idUsuario`),
  KEY `idConversa_idx` (`idConversa`),
  CONSTRAINT `idConversa` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idUsuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.participantes
DROP TABLE IF EXISTS `participantes`;
CREATE TABLE IF NOT EXISTS `participantes` (
  `idParticipantes` int NOT NULL AUTO_INCREMENT,
  `idConversa` int NOT NULL,
  `idParticipante` int NOT NULL,
  `cancelado` int DEFAULT NULL,
  PRIMARY KEY (`idParticipantes`),
  KEY `idConversa_idx` (`idConversa`),
  KEY `idParticipante_idx` (`idParticipante`),
  CONSTRAINT `idConversa_p` FOREIGN KEY (`idConversa`) REFERENCES `conversas` (`idConversa`),
  CONSTRAINT `idParticipante` FOREIGN KEY (`idParticipante`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.permissoes
DROP TABLE IF EXISTS `permissoes`;
CREATE TABLE IF NOT EXISTS `permissoes` (
  `idPermissoes` int NOT NULL AUTO_INCREMENT,
  `idColaborador` int NOT NULL,
  `idCargo` int DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int DEFAULT NULL,
  PRIMARY KEY (`idPermissoes`),
  KEY `idProjetoColaboradores_idx` (`idColaborador`) /*!80000 INVISIBLE */,
  KEY `idCargo_idx` (`idCargo`),
  KEY `usuarioAlterou_idx` (`usuarioAlterou`),
  CONSTRAINT `idCargo_p` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`idCargos`),
  CONSTRAINT `idProjetoColaborador` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `usuarioAlterou_p` FOREIGN KEY (`usuarioAlterou`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.posts
DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `idPosts` int NOT NULL AUTO_INCREMENT,
  `idTopico` int NOT NULL,
  `idAutor` int NOT NULL,
  `idProjeto` int NOT NULL,
  `descricao` varchar(45) NOT NULL,
  `conteudo` text NOT NULL,
  `dataHora` datetime NOT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `resposta` int DEFAULT NULL,
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
DROP TABLE IF EXISTS `projetocolaboradores`;
CREATE TABLE IF NOT EXISTS `projetocolaboradores` (
  `idProjetoColaborador` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idProjeto` int NOT NULL,
  `cancelado` int DEFAULT NULL,
  `idCargo` int NOT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProjetoColaborador`),
  KEY `codigoUsuario_idx` (`idUsuario`),
  KEY `idProjeto_idx` (`idProjeto`),
  KEY `idCargo_idx` (`idCargo`),
  CONSTRAINT `codigoUsuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`),
  CONSTRAINT `idCargo` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`idCargos`),
  CONSTRAINT `idProjeto` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.projetos
DROP TABLE IF EXISTS `projetos`;
CREATE TABLE IF NOT EXISTS `projetos` (
  `idProjetos` int NOT NULL AUTO_INCREMENT,
  `nomeProjeto` varchar(45) NOT NULL,
  `codigoCriador` varchar(45) NOT NULL,
  `descricao` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`idProjetos`),
  UNIQUE KEY `idProjetos_UNIQUE` (`idProjetos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.reacoes
DROP TABLE IF EXISTS `reacoes`;
CREATE TABLE IF NOT EXISTS `reacoes` (
  `idReacoes` int NOT NULL AUTO_INCREMENT,
  `idMensagem` int NOT NULL,
  `idUsuario` int NOT NULL,
  `reacao` int DEFAULT NULL,
  `cancelado` int DEFAULT NULL,
  PRIMARY KEY (`idReacoes`),
  KEY `idMensagem_idx` (`idMensagem`),
  KEY `idUsuario_idx` (`idUsuario`),
  CONSTRAINT `idMensagem` FOREIGN KEY (`idMensagem`) REFERENCES `mensagens` (`idMensagem`),
  CONSTRAINT `idUsuario_r` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.sprints
DROP TABLE IF EXISTS `sprints`;
CREATE TABLE IF NOT EXISTS `sprints` (
  `idSprints` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `dataFinal` datetime DEFAULT NULL,
  `cancelada` tinyint DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idSprints`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.status
DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `idStatus` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cancelado` tinyint DEFAULT NULL,
  PRIMARY KEY (`idStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefas
DROP TABLE IF EXISTS `tarefas`;
CREATE TABLE IF NOT EXISTS `tarefas` (
  `idTarefas` int NOT NULL AUTO_INCREMENT,
  `assunto` varchar(45) NOT NULL,
  `prioridade` int NOT NULL,
  `cancelada` tinyint DEFAULT NULL,
  `ultimaResposta` datetime DEFAULT NULL,
  `idAutor` int NOT NULL,
  `autorRazaoSocial` varchar(45) NOT NULL,
  `idProjeto` int NOT NULL,
  `idStatus` int NOT NULL,
  `idSprint` int DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTarefas`),
  KEY `idAutor_idx` (`idAutor`),
  KEY `idProjeto_idx` (`idProjeto`),
  KEY `idStatus_idx` (`idStatus`),
  KEY `idSprint_idx` (`idSprint`),
  CONSTRAINT `idAutor` FOREIGN KEY (`idAutor`) REFERENCES `projetocolaboradores` (`idUsuario`),
  CONSTRAINT `idProjeto_t` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idSprint` FOREIGN KEY (`idSprint`) REFERENCES `sprints` (`idSprints`),
  CONSTRAINT `idStatus` FOREIGN KEY (`idStatus`) REFERENCES `status` (`idStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefasrespostas
DROP TABLE IF EXISTS `tarefasrespostas`;
CREATE TABLE IF NOT EXISTS `tarefasrespostas` (
  `idTarefasResposta` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `idTarefa` int NOT NULL,
  `idColaborador` int NOT NULL,
  `statusAnterior` int NOT NULL,
  `statusNovo` int NOT NULL,
  `resposta` varchar(45) NOT NULL,
  `dataResposta` datetime NOT NULL,
  PRIMARY KEY (`idTarefasResposta`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idColaborador_idx` (`idColaborador`),
  CONSTRAINT `idColaborador_tt` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idTarefa_tt` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.tarefastempo
DROP TABLE IF EXISTS `tarefastempo`;
CREATE TABLE IF NOT EXISTS `tarefastempo` (
  `idTarefasTempo` int NOT NULL AUTO_INCREMENT,
  `idTarefa` int NOT NULL,
  `idColaborador` int NOT NULL,
  `idStatus` int NOT NULL,
  `dataInicio` datetime NOT NULL,
  `dataFinal` datetime DEFAULT NULL,
  PRIMARY KEY (`idTarefasTempo`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idColaborador_idx` (`idColaborador`),
  KEY `idStatus_idx` (`idStatus`),
  CONSTRAINT `idColaborador` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idStatus_t` FOREIGN KEY (`idStatus`) REFERENCES `status` (`idStatus`),
  CONSTRAINT `idTarefa_t` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.topicos
DROP TABLE IF EXISTS `topicos`;
CREATE TABLE IF NOT EXISTS `topicos` (
  `idTopicos` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(70) DEFAULT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `idCriador` int NOT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTopicos`),
  KEY `idCriador_idx` (`idCriador`),
  CONSTRAINT `idCriador` FOREIGN KEY (`idCriador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela mydb.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuarios` int NOT NULL AUTO_INCREMENT,
  `nomeUsuario` varchar(60) NOT NULL,
  `dataNascimento` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(30) NOT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Exportação de dados foi desmarcado.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
