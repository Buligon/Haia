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
CREATE DATABASE IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mydb`;

-- Copiando estrutura para tabela mydb.cargos
CREATE TABLE IF NOT EXISTS `cargos` (
  `idCargos` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `usuarioAlterou` int DEFAULT NULL,
  PRIMARY KEY (`idCargos`),
  KEY `usuarioAlterou_idx` (`usuarioAlterou`),
  CONSTRAINT `usuarioAlterou_c` FOREIGN KEY (`usuarioAlterou`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.cargos: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` (`idCargos`, `nome`, `descricao`, `cancelado`, `dataAlteracao`, `usuarioAlterou`) VALUES
	(1, 'cargo 1', 'teste 1', NULL, NULL, NULL),
	(2, 'cargo 2', 'teste 2', NULL, '2022-01-12 23:09:44', 4);
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.conversas
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

-- Copiando dados para a tabela mydb.conversas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `conversas` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversas` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.conversasfixadas
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

-- Copiando dados para a tabela mydb.conversasfixadas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `conversasfixadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversasfixadas` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.convites
CREATE TABLE IF NOT EXISTS `convites` (
  `idConvites` int NOT NULL AUTO_INCREMENT,
  `idProjeto` int NOT NULL,
  `email` varchar(45) NOT NULL,
  `aceito` tinyint DEFAULT NULL,
  PRIMARY KEY (`idConvites`),
  KEY `idProjeto_Conv_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Conv` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.convites: ~12 rows (aproximadamente)
/*!40000 ALTER TABLE `convites` DISABLE KEYS */;
INSERT INTO `convites` (`idConvites`, `idProjeto`, `email`, `aceito`) VALUES
	(1, 1, 'lukasbuligonantunes@gmail.com', NULL),
	(2, 1, 'lukasbuligonantunes@gmail.com', NULL),
	(3, 1, 'lukasbuligonantunes@gmail.com', 1),
	(4, 22, 'lukasbuligonantunes@gmail.com', 1),
	(5, 1, 'twetwdajsbdhs@asjbd.com', NULL),
	(6, 1, 'fjbaf@sdknf.com', NULL),
	(7, 32, 'lukasbuligonantunes@gmail.com', 1),
	(8, 27, 'lukasbuligonantunes@gmail.com', 1),
	(9, 10, 'lukasbuligonantunes@gmail.com', 1),
	(10, 10, 'lukasbuligonantunes@gmail.com', 1),
	(11, 1, 'fasf@flknha.sfkna', NULL),
	(12, 33, 'lukasbuligonantunes@gmail.com', 1),
	(13, 1, 'lukasbuligonantunes@gmail.com', NULL);
/*!40000 ALTER TABLE `convites` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.mensagens
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

-- Copiando dados para a tabela mydb.mensagens: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `mensagens` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensagens` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.participantes
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

-- Copiando dados para a tabela mydb.participantes: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `participantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `participantes` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.permissoes
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

-- Copiando dados para a tabela mydb.permissoes: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `permissoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissoes` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.posts
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

-- Copiando dados para a tabela mydb.posts: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.projetoacessos
CREATE TABLE IF NOT EXISTS `projetoacessos` (
  `idProjetoAcessos` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idProjeto` int NOT NULL,
  `dataAcesso` datetime NOT NULL,
  PRIMARY KEY (`idProjetoAcessos`),
  KEY `idUsuario_Acesso_idx` (`idUsuario`),
  KEY `idProjeto_Acesso_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Acesso` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idUsuario_Acesso` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=803 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.projetoacessos: ~8 rows (aproximadamente)
/*!40000 ALTER TABLE `projetoacessos` DISABLE KEYS */;
INSERT INTO `projetoacessos` (`idProjetoAcessos`, `idUsuario`, `idProjeto`, `dataAcesso`) VALUES
	(680, 49, 33, '2022-01-20 19:07:37'),
	(681, 49, 33, '2022-01-20 19:08:33'),
	(687, 42, 1, '2022-01-21 02:43:14'),
	(688, 42, 1, '2022-01-21 02:46:34'),
	(726, 50, 34, '2022-01-21 19:49:21'),
	(727, 50, 34, '2022-01-21 19:49:30'),
	(801, 48, 37, '2022-01-22 20:43:35'),
	(802, 48, 37, '2022-01-22 20:43:58');
/*!40000 ALTER TABLE `projetoacessos` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.projetocolaboradores
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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.projetocolaboradores: ~41 rows (aproximadamente)
/*!40000 ALTER TABLE `projetocolaboradores` DISABLE KEYS */;
INSERT INTO `projetocolaboradores` (`idProjetoColaborador`, `idUsuario`, `idProjeto`, `cancelado`, `idCargo`, `dataCriacao`, `dataAlteracao`) VALUES
	(4, 42, 1, NULL, 1, '2021-12-27 20:15:47', '2021-12-27 20:15:47'),
	(5, 41, 1, 1, 1, '2022-01-07 00:09:24', '2022-01-20 19:04:13'),
	(6, 42, 10, NULL, 1, '2022-01-11 22:07:25', '2022-01-12 01:07:25'),
	(7, 42, 11, NULL, 1, '2022-01-11 22:08:07', '2022-01-12 01:08:07'),
	(8, 42, 12, NULL, 1, '2022-01-11 22:09:04', '2022-01-12 01:09:04'),
	(9, 42, 13, NULL, 1, '2022-01-11 22:09:29', '2022-01-12 01:09:29'),
	(10, 42, 14, NULL, 1, '2022-01-11 22:09:53', '2022-01-12 01:09:53'),
	(11, 42, 15, NULL, 1, '2022-01-11 22:10:14', '2022-01-12 01:10:14'),
	(12, 42, 16, NULL, 1, '2022-01-11 22:10:24', '2022-01-12 01:10:24'),
	(13, 42, 17, NULL, 1, '2022-01-11 22:13:00', '2022-01-12 01:13:00'),
	(14, 42, 18, NULL, 1, '2022-01-11 22:13:04', '2022-01-12 01:13:04'),
	(15, 42, 19, NULL, 1, '2022-01-11 22:15:07', '2022-01-12 01:15:07'),
	(16, 42, 20, NULL, 1, '2022-01-11 22:15:13', '2022-01-12 01:15:13'),
	(17, 42, 21, NULL, 1, '2022-01-11 22:15:26', '2022-01-12 01:15:26'),
	(18, 42, 22, NULL, 1, '2022-01-11 22:16:57', '2022-01-12 01:16:57'),
	(19, 42, 23, NULL, 1, '2022-01-11 22:19:34', '2022-01-12 01:19:34'),
	(20, 42, 24, NULL, 1, '2022-01-11 23:08:37', '2022-01-12 02:08:37'),
	(21, 45, 25, NULL, 1, '2022-01-11 23:12:36', '2022-01-12 02:12:36'),
	(22, 45, 26, NULL, 1, '2022-01-11 23:15:44', '2022-01-12 02:15:44'),
	(29, 48, 22, NULL, 2, '2022-01-12 23:09:54', '2022-01-13 02:09:54'),
	(30, 48, 22, NULL, 2, '2022-01-12 23:11:27', '2022-01-13 02:11:27'),
	(31, 48, 22, NULL, 2, '2022-01-12 23:11:32', '2022-01-13 02:11:32'),
	(32, 48, 22, NULL, 2, '2022-01-12 23:11:37', '2022-01-13 02:11:37'),
	(33, 48, 22, NULL, 2, '2022-01-12 23:11:49', '2022-01-13 02:11:49'),
	(34, 42, 27, NULL, 1, '2022-01-14 14:38:54', '2022-01-14 17:38:54'),
	(35, 42, 28, NULL, 1, '2022-01-19 18:54:34', '2022-01-19 21:54:34'),
	(36, 42, 29, NULL, 1, '2022-01-19 18:56:01', '2022-01-19 21:56:01'),
	(37, 42, 30, NULL, 1, '2022-01-19 18:56:42', '2022-01-19 21:56:42'),
	(38, 42, 31, NULL, 1, '2022-01-19 18:58:14', '2022-01-19 21:58:14'),
	(39, 42, 32, NULL, 1, '2022-01-19 20:25:26', '2022-01-19 23:25:26'),
	(40, 49, 10, NULL, 2, '2022-01-20 15:29:36', '2022-01-20 18:29:36'),
	(41, 42, 33, NULL, 1, '2022-01-20 16:04:42', '2022-01-20 19:04:42'),
	(42, 49, 10, NULL, 2, '2022-01-20 16:05:15', '2022-01-20 19:05:15'),
	(43, 49, 10, NULL, 2, '2022-01-20 16:06:10', '2022-01-20 19:06:10'),
	(44, 49, 10, NULL, 2, '2022-01-20 16:06:20', '2022-01-20 19:06:20'),
	(45, 49, 10, NULL, 2, '2022-01-20 16:06:43', '2022-01-20 19:06:43'),
	(46, 49, 10, NULL, 2, '2022-01-20 16:06:51', '2022-01-20 19:06:51'),
	(47, 49, 10, NULL, 2, '2022-01-20 16:07:15', '2022-01-20 19:07:15'),
	(48, 49, 33, 1, 2, '2022-01-20 16:07:32', '2022-01-20 19:07:41'),
	(49, 49, 10, NULL, 2, '2022-01-20 16:08:18', '2022-01-20 19:08:18'),
	(50, 49, 10, NULL, 2, '2022-01-20 22:31:42', '2022-01-21 01:31:42'),
	(51, 50, 34, NULL, 1, '2022-01-21 16:47:13', '2022-01-21 19:47:13'),
	(52, 48, 35, NULL, 1, '2022-01-22 14:54:34', '2022-01-22 17:54:34'),
	(53, 48, 36, NULL, 1, '2022-01-22 16:47:04', '2022-01-22 19:47:04'),
	(54, 48, 37, NULL, 1, '2022-01-22 17:31:12', '2022-01-22 20:31:12');
/*!40000 ALTER TABLE `projetocolaboradores` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.projetos
CREATE TABLE IF NOT EXISTS `projetos` (
  `idProjetos` int NOT NULL AUTO_INCREMENT,
  `nomeProjeto` varchar(45) NOT NULL,
  `codigoCriador` varchar(45) NOT NULL,
  `descricao` varchar(300) DEFAULT NULL,
  `Cancelado` int DEFAULT NULL,
  `banner` longblob,
  PRIMARY KEY (`idProjetos`),
  UNIQUE KEY `idProjetos_UNIQUE` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.projetos: ~32 rows (aproximadamente)
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
INSERT INTO `projetos` (`idProjetos`, `nomeProjeto`, `codigoCriador`, `descricao`, `Cancelado`, `banner`) VALUES
	(1, 'Teste', '1', 'Isso é um teste de projeto', NULL, NULL),
	(2, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2', ' aaa aaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaa aaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaa', NULL, NULL),
	(3, 'tesfsef', '3', 'value_dasdadsb', NULL, NULL),
	(4, 'teste', '42', '', NULL, NULL),
	(5, 'teste', '42', 'tste', NULL, NULL),
	(6, 'teste 3', '42', 'teste 3', NULL, NULL),
	(7, 'teste', '42', 'teste', NULL, NULL),
	(8, 'teste', '42', 'teste', NULL, NULL),
	(9, 'teste', '42', 'test', NULL, NULL),
	(10, 'teste', '42', 'testes', NULL, NULL),
	(11, 'teste projeto', '42', 'teste projeto as', NULL, NULL),
	(12, 'teste', '42', 'teste', NULL, NULL),
	(13, 'teste', '42', 'teste', NULL, NULL),
	(14, 'teste', '42', 'tsetse', NULL, NULL),
	(15, 'tset', '42', 'tsete', NULL, NULL),
	(16, 'teste', '42', 'teste', NULL, NULL),
	(17, 'tset', '42', 'teste', NULL, NULL),
	(18, 'teste', '42', 'teste', NULL, NULL),
	(19, 'teste', '42', 'teste', NULL, NULL),
	(20, 'test', '42', 'teste', NULL, NULL),
	(21, 'teste', '42', 'teste', NULL, NULL),
	(22, 'teste3 414', '42', 'trt3453', NULL, NULL),
	(23, 'teste', '42', 'teste', NULL, _binary 0x31666437663065302D373234392D343638652D613636662D6237303933666632613161332E6A666966),
	(24, 'test', '42', 'teste', NULL, NULL),
	(25, 'etste', '45', 'tsets', NULL, NULL),
	(26, 'twat', '45', 'ast', NULL, NULL),
	(27, 'Teste completo', '42', 'TEste completo', NULL, NULL),
	(28, 'teste', '42', 'teste', NULL, NULL),
	(29, 'teste', '42', 'teste', NULL, NULL),
	(30, 'etstes', '42', 'tetset', NULL, NULL),
	(31, 'teste', '42', 'tsteste', NULL, NULL),
	(32, 'teste', '42', 'teste', NULL, NULL),
	(33, 'testse exclusção', '42', 'rsfet', NULL, NULL),
	(34, 'teste', '50', 'etsett', NULL, NULL),
	(35, 'tecveasrfefsefe', '48', 'teste3 tedasdknlsafjhkabkfshbv ahjgkfjhbj', 1, NULL),
	(36, 'teste32', '48', 'tset34', 1, NULL),
	(37, 'teste', '48', 'setests', NULL, NULL);
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.reacoes
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

-- Copiando dados para a tabela mydb.reacoes: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `reacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reacoes` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.sprints
CREATE TABLE IF NOT EXISTS `sprints` (
  `idSprints` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `dataCriacao` datetime NOT NULL,
  `cancelada` tinyint DEFAULT NULL,
  `dataAlteracao` datetime DEFAULT NULL,
  `idProjeto` int NOT NULL,
  PRIMARY KEY (`idSprints`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Sp` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.sprints: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `sprints` DISABLE KEYS */;
INSERT INTO `sprints` (`idSprints`, `nome`, `dataCriacao`, `cancelada`, `dataAlteracao`, `idProjeto`) VALUES
	(1, 'teste', '2022-01-05 20:22:31', NULL, NULL, 1),
	(2, 'Desenvolvimento', '2022-01-05 20:23:00', NULL, '2022-01-14 17:24:56', 1),
	(3, 'testefsefse', '2022-01-14 14:19:47', 1, '2022-01-14 17:24:09', 1),
	(4, 'Sprint T', '2022-01-14 17:37:48', 1, '2022-01-14 17:38:04', 1),
	(5, 'Teste', '2022-01-14 17:39:14', NULL, NULL, 27),
	(6, 'hm', '2022-01-16 00:53:18', NULL, NULL, 1),
	(7, 'Teste', '2022-01-19 23:27:53', NULL, NULL, 32);
/*!40000 ALTER TABLE `sprints` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.status
CREATE TABLE IF NOT EXISTS `status` (
  `idStatus` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `idProjeto` int NOT NULL,
  PRIMARY KEY (`idStatus`),
  KEY `idProjeto_Sta_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_Sta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.status: ~8 rows (aproximadamente)
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` (`idStatus`, `nome`, `cancelado`, `idProjeto`) VALUES
	(1, 'Análise de viabilidade                    ', NULL, 1),
	(2, 'Teste', NULL, 1),
	(3, 'teste', NULL, 1),
	(6, 'Teste', NULL, 1),
	(7, 'Status 1', NULL, 27),
	(8, 'Desenvolvimento', NULL, 32),
	(9, 'teste', NULL, 22),
	(10, 'ydrydr', NULL, 34);
/*!40000 ALTER TABLE `status` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `idTags` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) NOT NULL,
  `cor` char(7) DEFAULT NULL,
  `prioridade` int NOT NULL,
  `cancelada` tinyint DEFAULT NULL,
  `idProjeto` int NOT NULL,
  PRIMARY KEY (`idTags`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_ta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.tags: ~17 rows (aproximadamente)
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` (`idTags`, `descricao`, `cor`, `prioridade`, `cancelada`, `idProjeto`) VALUES
	(1, 'teste 1', '#F2DC6B', 0, 1, 1),
	(2, 'Teste geral', '#ff0000', 2, 1, 1),
	(3, 'teste 3', '#bb86fc', 0, 1, 1),
	(4, 'teste 4', '#6e90af', 0, 1, 1),
	(5, 'teste 5', '#42b368', 1, 1, 1),
	(6, 'teste 6', '#382550', 3, NULL, 1),
	(7, 'teste 8', '#6e479e', 2, NULL, 1),
	(8, 'teste tag', '#5da7b6', 0, NULL, 1),
	(9, 'setest', '#bb86fc', 0, NULL, 1),
	(10, 'teste', '#bb86fc', 0, NULL, 25),
	(11, 'testete', '#bb86fc', 0, NULL, 25),
	(12, 'testdt', '#bb86fc', 0, NULL, 25),
	(13, 'tewste', '#bb86fc', 0, NULL, 26),
	(14, 'p1', '#fc8ded', 1, NULL, 1),
	(15, '1', '#d8097e', 4, 1, 1),
	(16, '2', '#8c579c', 4, 1, 1),
	(17, '3', '#24468e', 4, 1, 1),
	(18, 'teste tag', '#bb86fc', 1, NULL, 1),
	(19, 'teste', '#bb86fc', 1424, NULL, 1),
	(20, 'aaaaaa', '#bb86fc', 142, NULL, 1),
	(21, 'Impedida', '#ff1a1a', 5, NULL, 32);
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.tarefas
CREATE TABLE IF NOT EXISTS `tarefas` (
  `idTarefas` int NOT NULL AUTO_INCREMENT,
  `assunto` varchar(45) NOT NULL,
  `prioridade` varchar(6) NOT NULL DEFAULT '',
  `cancelada` tinyint DEFAULT NULL,
  `ultimaResposta` datetime DEFAULT NULL,
  `idAutor` int NOT NULL,
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
  CONSTRAINT `idAutor` FOREIGN KEY (`idAutor`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idProjeto_t` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idSprint` FOREIGN KEY (`idSprint`) REFERENCES `sprints` (`idSprints`),
  CONSTRAINT `idStatus` FOREIGN KEY (`idStatus`) REFERENCES `status` (`idStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.tarefas: ~68 rows (aproximadamente)
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` (`idTarefas`, `assunto`, `prioridade`, `cancelada`, `ultimaResposta`, `idAutor`, `idProjeto`, `idStatus`, `idSprint`, `dataCriacao`, `dataAlteracao`) VALUES
	(9, 'teste', 'Alta', NULL, '2022-01-10 23:09:33', 4, 1, 1, NULL, '2022-01-10 20:09:33', '2022-01-10 23:09:33'),
	(10, 'tset', 'Alta', NULL, '2022-01-10 23:10:28', 4, 1, 1, NULL, '2022-01-10 20:10:28', '2022-01-10 23:10:28'),
	(11, 'teste', 'Alta', NULL, '2022-01-10 23:15:14', 4, 1, 1, NULL, '2022-01-10 20:15:14', '2022-01-10 23:15:14'),
	(12, 'test', 'Alta', NULL, '2022-01-10 23:16:35', 4, 1, 1, NULL, '2022-01-10 20:16:35', '2022-01-10 23:16:35'),
	(13, 'tset', 'Alta', NULL, '2022-01-10 23:17:44', 4, 1, 1, NULL, '2022-01-10 20:17:44', '2022-01-10 23:17:44'),
	(14, 'tsete', 'Alta', NULL, '2022-01-10 23:18:03', 4, 1, 1, NULL, '2022-01-10 20:18:03', '2022-01-10 23:18:03'),
	(15, 'tset', 'Alta', NULL, '2022-01-10 23:19:16', 4, 1, 1, NULL, '2022-01-10 20:19:16', '2022-01-10 23:19:16'),
	(16, 'teste', 'Alta', NULL, '2022-01-10 23:20:41', 4, 1, 1, NULL, '2022-01-10 20:20:41', '2022-01-10 23:20:41'),
	(17, 'teste', 'Alta', NULL, '2022-01-10 23:21:56', 4, 1, 1, NULL, '2022-01-10 20:21:56', '2022-01-10 23:21:56'),
	(18, 'teste', 'Alta', NULL, '2022-01-10 23:22:44', 4, 1, 1, NULL, '2022-01-10 20:22:44', '2022-01-10 23:22:44'),
	(19, 'teste', 'Alta', NULL, '2022-01-10 23:23:09', 4, 1, 1, NULL, '2022-01-10 20:23:09', '2022-01-10 23:23:09'),
	(20, 'ydry', 'Alta', NULL, '2022-01-10 23:23:55', 4, 1, 1, NULL, '2022-01-10 20:23:55', '2022-01-10 23:23:55'),
	(21, 'tset', 'Alta', NULL, '2022-01-10 23:24:26', 4, 1, 1, NULL, '2022-01-10 20:24:26', '2022-01-10 23:24:26'),
	(22, 'tset', 'Alta', NULL, '2022-01-10 23:25:06', 4, 1, 1, NULL, '2022-01-10 20:25:06', '2022-01-10 23:25:06'),
	(23, 'test', 'Alta', NULL, '2022-01-10 23:26:14', 4, 1, 1, NULL, '2022-01-10 20:26:14', '2022-01-10 23:26:14'),
	(24, 'teste', 'Alta', NULL, '2022-01-10 23:27:24', 4, 1, 1, NULL, '2022-01-10 20:27:24', '2022-01-10 23:27:24'),
	(25, 'teste', 'Alta', NULL, '2022-01-10 23:28:18', 4, 1, 1, NULL, '2022-01-10 20:28:18', '2022-01-10 23:28:18'),
	(26, 'tsets', 'Alta', NULL, '2022-01-10 23:28:52', 4, 1, 1, NULL, '2022-01-10 20:28:52', '2022-01-10 23:28:52'),
	(27, 'teste tarefa', 'Alta', NULL, '2022-01-10 23:31:06', 4, 1, 1, NULL, '2022-01-10 20:31:06', '2022-01-10 23:31:06'),
	(28, 'teste', 'Alta', NULL, '2022-01-10 23:31:38', 4, 1, 1, NULL, '2022-01-10 20:31:38', '2022-01-10 23:31:38'),
	(29, 'testet c', 'Alta', NULL, '2022-01-10 23:33:24', 4, 1, 1, 1, '2022-01-10 20:33:24', '2022-01-10 20:35:42'),
	(30, 'rwarw', 'Alta', NULL, '2022-01-10 23:34:17', 4, 1, 1, NULL, '2022-01-10 20:34:17', '2022-01-10 23:34:17'),
	(31, 'tsete', 'Alta', NULL, '2022-01-10 23:34:50', 4, 1, 1, NULL, '2022-01-10 20:34:50', '2022-01-10 23:34:50'),
	(32, 'testet', 'Alta', NULL, '2022-01-10 23:36:37', 4, 1, 1, NULL, '2022-01-10 20:36:37', '2022-01-10 23:36:37'),
	(33, 'tsets', 'Alta', NULL, '2022-01-10 23:37:18', 4, 1, 1, NULL, '2022-01-10 20:37:18', '2022-01-10 23:37:18'),
	(36, 'test', 'Alta', NULL, '2022-01-10 23:40:04', 4, 1, 1, NULL, '2022-01-10 20:40:04', '2022-01-10 23:40:04'),
	(37, 'teste', 'Alta', NULL, '2022-01-10 23:40:15', 4, 1, 1, 1, '2022-01-10 20:40:15', '2022-01-10 23:40:15'),
	(38, 'Cadastro de tarefa teste', 'Alta', NULL, '2022-01-11 05:01:19', 4, 1, 1, NULL, '2022-01-11 02:01:19', '2022-01-11 05:01:19'),
	(39, 'tarefa aleatória 2354', 'Normal', NULL, '2022-01-11 05:02:14', 4, 1, 1, NULL, '2022-01-11 02:02:14', '2022-01-15 00:12:34'),
	(40, 'Teste tarefa', 'Alta', NULL, '2022-01-14 17:39:52', 34, 27, 7, 5, '2022-01-14 14:39:52', '2022-01-14 17:39:52'),
	(41, 'teste 1', 'Alta', NULL, '2022-01-15 00:36:16', 4, 1, 1, NULL, '2022-01-14 21:36:16', '2022-01-15 00:36:16'),
	(42, 'tetwetwt', 'Alta', NULL, '2022-01-15 00:37:11', 4, 1, 1, NULL, '2022-01-14 21:37:11', '2022-01-15 00:37:11'),
	(43, 'tesfe', 'Alta', NULL, '2022-01-15 00:37:38', 4, 1, 1, NULL, '2022-01-14 21:37:38', '2022-01-15 00:37:38'),
	(44, 'wetwet', 'Alta', NULL, '2022-01-15 00:39:08', 4, 1, 1, NULL, '2022-01-14 21:39:08', '2022-01-15 00:39:08'),
	(45, 'tewtstest', 'Alta', NULL, '2022-01-15 16:57:02', 4, 1, 1, NULL, '2022-01-15 13:57:02', '2022-01-15 16:57:02'),
	(46, 'teste taerefga', 'Alta', NULL, '2022-01-15 16:59:48', 4, 1, 1, NULL, '2022-01-15 13:59:48', '2022-01-15 16:59:48'),
	(47, 'TESFESTE', 'Alta', NULL, '2022-01-15 17:01:48', 4, 1, 1, NULL, '2022-01-15 14:01:48', '2022-01-15 17:01:48'),
	(48, 'TESFSET', 'Alta', NULL, '2022-01-15 17:02:15', 4, 1, 1, NULL, '2022-01-15 14:02:15', '2022-01-15 17:02:15'),
	(49, 'tesef', 'Alta', NULL, '2022-01-15 17:11:10', 4, 1, 1, NULL, '2022-01-15 14:11:10', '2022-01-15 17:11:10'),
	(50, 'dawdawd', 'Alta', NULL, '2022-01-15 17:18:20', 4, 1, 1, NULL, '2022-01-15 14:18:20', '2022-01-15 17:18:20'),
	(51, 'dwewe', 'Alta', NULL, '2022-01-15 17:28:02', 4, 1, 1, NULL, '2022-01-15 14:28:02', '2022-01-15 17:28:02'),
	(52, 'dfwdawd', 'Alta', NULL, '2022-01-15 17:29:39', 4, 1, 1, NULL, '2022-01-15 14:29:39', '2022-01-15 17:29:39'),
	(53, 'tewtrwet', 'Alta', NULL, '2022-01-18 13:21:12', 4, 1, 1, NULL, '2022-01-15 14:31:21', '2022-01-18 13:21:12'),
	(54, 'awefewt', 'Alta', NULL, '2022-01-15 17:35:48', 4, 1, 1, NULL, '2022-01-15 14:35:48', '2022-01-15 17:35:48'),
	(55, 'tefset', 'Alta', NULL, '2022-01-15 17:35:59', 4, 1, 1, NULL, '2022-01-15 14:35:59', '2022-01-15 17:35:59'),
	(56, 'ewtewet', 'Alta', NULL, '2022-01-15 21:45:49', 4, 1, 1, NULL, '2022-01-15 18:45:49', '2022-01-15 21:45:49'),
	(57, 'tertet', 'Alta', NULL, '2022-01-15 21:56:45', 4, 1, 1, NULL, '2022-01-15 18:56:45', '2022-01-15 21:56:45'),
	(58, 'twetwte', 'Alta', 1, '2022-01-15 21:58:39', 4, 1, 1, NULL, '2022-01-15 18:58:39', '2022-01-15 21:57:40'),
	(59, 'festetse', 'Alta', 1, '2022-01-15 22:52:20', 4, 1, 1, NULL, '2022-01-15 19:52:20', '2022-01-15 21:57:41'),
	(60, 'testet', 'Alta', 1, '2022-01-16 00:33:39', 4, 1, 1, NULL, '2022-01-15 21:33:39', '2022-01-15 21:57:45'),
	(61, 'teste', 'Alta', 1, '2022-01-16 00:52:04', 4, 1, 1, 6, '2022-01-15 21:52:04', '2022-01-15 21:56:56'),
	(62, 'teste', 'Alta', 1, '2022-01-16 00:52:15', 4, 1, 1, 6, '2022-01-15 21:52:15', '2022-01-15 21:57:15'),
	(63, 'teste', 'Alta', 1, '2022-01-16 00:52:24', 4, 1, 1, 6, '2022-01-15 21:52:24', '2022-01-15 21:57:17'),
	(64, 'Teste tags', 'Alta', NULL, '2022-01-20 18:11:27', 4, 1, 1, NULL, '2022-01-15 23:48:52', '2022-01-20 18:11:27'),
	(65, 'teste', 'Alta', NULL, '2022-01-18 20:09:19', 4, 1, 1, NULL, '2022-01-18 17:09:19', '2022-01-18 20:09:19'),
	(66, 'teste', 'Alta', NULL, '2022-01-18 20:31:15', 4, 1, 1, NULL, '2022-01-18 17:31:15', '2022-01-18 20:31:15'),
	(67, 'teste', 'Alta', NULL, '2022-01-18 20:31:43', 4, 1, 1, NULL, '2022-01-18 17:31:43', '2022-01-18 20:31:43'),
	(68, 'teste', 'Alta', NULL, '2022-01-18 20:32:30', 4, 1, 1, NULL, '2022-01-18 17:32:30', '2022-01-18 20:32:30'),
	(69, 'teste', 'Alta', NULL, '2022-01-18 20:33:28', 4, 1, 1, NULL, '2022-01-18 17:33:28', '2022-01-18 20:33:28'),
	(70, 'yrdyr', 'Alta', NULL, '2022-01-18 20:34:13', 4, 1, 1, NULL, '2022-01-18 17:34:13', '2022-01-18 20:34:13'),
	(71, 'test', 'Alta', NULL, '2022-01-18 20:35:20', 4, 1, 1, NULL, '2022-01-18 17:35:20', '2022-01-18 20:35:20'),
	(72, 'test', 'Alta', NULL, '2022-01-18 20:35:55', 4, 1, 1, NULL, '2022-01-18 17:35:55', '2022-01-18 20:35:55'),
	(73, 'teste', 'Alta', NULL, '2022-01-18 20:37:11', 4, 1, 1, NULL, '2022-01-18 17:37:11', '2022-01-18 20:37:11'),
	(74, 'teste', 'Alta', NULL, '2022-01-18 20:37:33', 4, 1, 1, NULL, '2022-01-18 17:37:33', '2022-01-18 20:37:33'),
	(75, 'teste', 'Alta', NULL, '2022-01-18 20:39:27', 4, 1, 1, NULL, '2022-01-18 17:39:27', '2022-01-18 20:39:27'),
	(76, 'tsete', 'Alta', NULL, '2022-01-18 20:41:07', 4, 1, 1, NULL, '2022-01-18 17:41:07', '2022-01-18 20:41:07'),
	(77, 'teste', 'Alta', NULL, '2022-01-19 19:07:51', 4, 1, 1, NULL, '2022-01-18 17:41:13', '2022-01-19 19:07:51'),
	(78, 'Tarefa teste', 'Normal', NULL, '2022-01-19 23:39:10', 39, 32, 8, NULL, '2022-01-19 20:30:42', '2022-01-19 23:39:10'),
	(79, 'tsete', 'Alta', NULL, '2022-01-21 17:47:47', 29, 22, 9, NULL, '2022-01-21 14:47:47', '2022-01-21 17:47:47'),
	(80, 'yrdyr', 'Alta', NULL, '2022-01-21 19:49:35', 51, 34, 10, NULL, '2022-01-21 16:49:35', '2022-01-21 19:49:35');
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.tarefasrespostas
CREATE TABLE IF NOT EXISTS `tarefasrespostas` (
  `idTarefasResposta` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `idTarefa` int NOT NULL,
  `idColaborador` int NOT NULL,
  `statusAnterior` int NOT NULL,
  `statusNovo` int NOT NULL,
  `resposta` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `dataResposta` datetime NOT NULL,
  PRIMARY KEY (`idTarefasResposta`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idColaborador_idx` (`idColaborador`),
  CONSTRAINT `idColaborador_tt` FOREIGN KEY (`idColaborador`) REFERENCES `projetocolaboradores` (`idProjetoColaborador`),
  CONSTRAINT `idTarefa_tt` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.tarefasrespostas: ~106 rows (aproximadamente)
/*!40000 ALTER TABLE `tarefasrespostas` DISABLE KEYS */;
INSERT INTO `tarefasrespostas` (`idTarefasResposta`, `idTarefa`, `idColaborador`, `statusAnterior`, `statusNovo`, `resposta`, `dataResposta`) VALUES
	(0000000001, 26, 4, 1, 1, 'estest', '2022-01-10 23:28:52'),
	(0000000002, 27, 4, 1, 1, 'isso é um detalhamento testes', '2022-01-10 23:31:06'),
	(0000000003, 28, 4, 1, 1, ' tes', '2022-01-10 23:31:38'),
	(0000000004, 29, 4, 1, 1, 'com sprint', '2022-01-10 23:33:24'),
	(0000000005, 30, 4, 1, 1, 'rwawarw', '2022-01-10 23:34:17'),
	(0000000006, 31, 4, 1, 1, 'tstet', '2022-01-10 23:34:51'),
	(0000000007, 31, 4, 1, 2, 'a@a', '2022-01-10 23:36:20'),
	(0000000008, 32, 4, 1, 1, 'sdfsdf', '2022-01-10 23:36:37'),
	(0000000009, 33, 4, 1, 1, 'teste', '2022-01-10 23:37:18'),
	(0000000010, 36, 4, 1, 1, 'tset', '2022-01-10 23:40:04'),
	(0000000011, 37, 4, 1, 1, 'etstetes', '2022-01-10 23:40:15'),
	(0000000012, 38, 4, 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non libero a sem iaculis tristique nec at risus. Aliquam viverra, lacus id accumsan accumsan, arcu turpis semper ipsum, vel porta ligula nisl in orci. Donec blandit commodo quam, a dignissim lorem tempus vitae. Curabitur malesuada ligula non ligula venenatis sollicitudin. Fusce in dolor eget leo laoreet tempor. Phasellus vitae eros magna. Donec at mattis nunc, ac fermentum neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\r\n\r\nPellentesque eget neque ut nulla elementum eleifend in nec nisl. Fusce pretium, justo in fringilla ultrices, neque quam laoreet ipsum, tristique venenatis magna risus eget ex. Etiam sollicitudin mi mi, sed ornare purus faucibus at. Sed laoreet urna vel eros ullamcorper, vel posuere justo pellentesque. Nulla rutrum sollicitudin pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi odio nibh, fermentum ut lectus ac, vehicula iaculis felis. Etiam a suscipit lacus. Suspendisse pulvinar orci metus, non pretium lacus porta ac. Proin sed condimentum felis. Nam ultrices tortor odio, non pulvinar metus tincidunt sed. Curabitur accumsan aliquet est, sed ultrices augue accumsan ac. Proin leo ipsum, accumsan sed tristique ut, semper id purus. Praesent in pulvinar dui.\r\n\r\nMauris euismod sed ipsum sed porta. Nunc at odio in orci mollis gravida vel quis nulla. Sed orci felis, vulputate at vulputate a, efficitur sit amet eros. Nam tempor et orci quis suscipit. Curabitur vel mi quis massa vulputate posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent felis tellus, mollis iaculis nisl sit amet, venenatis blandit magna. Etiam sit amet viverra nulla. Donec malesuada sem accumsan ultrices convallis. Etiam tempus risus nibh.', '2022-01-11 05:01:20'),
	(0000000013, 39, 4, 2, 2, 'Fusce at efficitur magna, sed consequat dui. Curabitur non mi ut felis efficitur pellentesque. Donec congue urna nisi, a fermentum ex finibus non. Donec ornare vestibulum metus, sed gravida eros volutpat vel. Duis fermentum vestibulum arcu vel tristique. Pellentesque gravida fermentum erat, sit amet euismod ex ultricies sit amet. Nulla id venenatis nunc. Curabitur ut mauris sit amet magna lacinia posuere quis et dui. Fusce scelerisque vestibulum nulla ac sagittis. Duis est est, vehicula non ullamcorper et, sagittis sit amet lacus. Fusce erat dolor, porta a turpis vel, bibendum pharetra justo. Vestibulum tempor, magna in accumsan imperdiet, est lorem placerat nulla, sed ultrices velit lectus ut quam. Sed sagittis nibh est, aliquam molestie metus dictum eget. Nam euismod, lacus a posuere venenatis, mi augue imperdiet dolor, eu ullamcorper lorem diam et felis.', '2022-01-11 05:02:14'),
	(0000000014, 39, 4, 2, 2, 'Etiam faucibus placerat enim mattis blandit. Aenean laoreet facilisis orci, a bibendum mi dapibus non. In hac habitasse platea dictumst. Vestibulum at bibendum lacus. Cras euismod turpis sit amet pulvinar condimentum. Morbi bibendum nunc placerat arcu venenatis accumsan. Pellentesque ac urna ex. Proin sagittis leo vel eros sollicitudin, ac laoreet dui feugiat. Cras imperdiet imperdiet ultricies.', '2022-01-11 05:02:25'),
	(0000000015, 39, 4, 2, 2, '', '2022-01-11 05:02:31'),
	(0000000016, 40, 34, 7, 7, 'tstesfesets', '2022-01-14 17:39:53'),
	(0000000017, 40, 34, 7, 2, '', '2022-01-14 17:39:57'),
	(0000000018, 39, 4, 2, 3, 'etste', '2022-01-14 22:56:38'),
	(0000000019, 39, 4, 3, 3, 'tsetset', '2022-01-14 22:57:38'),
	(0000000020, 39, 4, 3, 1, 'hfahfbasjkfhasfsafvaksjvasgvfaskjfvgavf', '2022-01-14 22:57:53'),
	(0000000021, 39, 4, 1, 2, 'sadnashfbashbfasbfau fas', '2022-01-14 22:58:02'),
	(0000000022, 39, 4, 2, 1, 'teste', '2022-01-14 22:58:36'),
	(0000000023, 39, 4, 1, 1, 'testest', '2022-01-14 23:21:53'),
	(0000000024, 39, 4, 1, 6, 'teste 1', '2022-01-14 23:23:28'),
	(0000000025, 39, 4, 6, 6, 'teste 3', '2022-01-14 23:23:39'),
	(0000000026, 39, 4, 6, 1, 'faefewsf', '2022-01-14 23:23:45'),
	(0000000027, 39, 4, 1, 1, 'tste', '2022-01-14 23:33:49'),
	(0000000028, 39, 4, 1, 1, 'teste', '2022-01-15 00:00:17'),
	(0000000029, 39, 4, 1, 1, 'teste', '2022-01-15 00:00:29'),
	(0000000030, 39, 4, 1, 1, '', '2022-01-15 00:00:39'),
	(0000000031, 39, 4, 1, 1, '', '2022-01-15 00:00:44'),
	(0000000032, 39, 4, 1, 1, '', '2022-01-15 00:01:19'),
	(0000000033, 39, 4, 1, 1, 'yrdyr', '2022-01-15 00:01:29'),
	(0000000034, 39, 4, 1, 1, 'tsetete', '2022-01-15 00:02:15'),
	(0000000035, 39, 4, 1, 1, 'teste', '2022-01-15 00:03:57'),
	(0000000036, 39, 4, 1, 1, 'tesresfse', '2022-01-15 00:05:48'),
	(0000000037, 39, 4, 1, 1, 'twetfrwef', '2022-01-15 00:08:02'),
	(0000000038, 39, 4, 1, 1, 'fesfesfetse', '2022-01-15 00:08:51'),
	(0000000039, 39, 4, 1, 1, 'sefesf', '2022-01-15 00:09:17'),
	(0000000040, 39, 4, 1, 1, 'fsefsefd', '2022-01-15 00:09:37'),
	(0000000041, 39, 4, 1, 1, 'fawdawdawd', '2022-01-15 00:10:05'),
	(0000000042, 39, 4, 1, 1, 'tesedffe', '2022-01-15 00:10:59'),
	(0000000043, 39, 4, 1, 1, 'a@a', '2022-01-15 00:11:35'),
	(0000000044, 39, 4, 1, 1, 'fseteste', '2022-01-15 00:12:14'),
	(0000000045, 39, 4, 1, 1, 'rsvcesf', '2022-01-15 00:12:27'),
	(0000000046, 39, 4, 1, 1, 'warwdfaw', '2022-01-15 00:12:31'),
	(0000000047, 39, 4, 1, 1, 'rawdawd', '2022-01-15 00:12:33'),
	(0000000048, 39, 4, 1, 1, '', '2022-01-15 00:12:34'),
	(0000000049, 39, 4, 1, 1, '', '2022-01-15 00:23:30'),
	(0000000050, 39, 4, 1, 1, '', '2022-01-15 00:23:39'),
	(0000000051, 39, 4, 1, 1, '', '2022-01-15 00:27:37'),
	(0000000052, 41, 4, 1, 1, 'dfjbhefsd bfljse', '2022-01-15 00:36:16'),
	(0000000053, 42, 4, 1, 1, 'ewtet', '2022-01-15 00:37:12'),
	(0000000054, 43, 4, 1, 1, 'stefse', '2022-01-15 00:37:38'),
	(0000000055, 44, 4, 1, 1, 'twetewt', '2022-01-15 00:39:08'),
	(0000000056, 45, 4, 1, 1, 'tesf', '2022-01-15 16:57:02'),
	(0000000057, 46, 4, 1, 1, 'teste', '2022-01-15 16:59:49'),
	(0000000058, 47, 4, 1, 1, 'TESFESF', '2022-01-15 17:01:48'),
	(0000000059, 48, 4, 1, 1, 'EFESTES', '2022-01-15 17:02:15'),
	(0000000060, 49, 4, 1, 1, 'esfest', '2022-01-15 17:11:10'),
	(0000000061, 50, 4, 1, 1, 'awdwadwar', '2022-01-15 17:18:20'),
	(0000000062, 51, 4, 1, 1, 'fewrtwetwef', '2022-01-15 17:28:02'),
	(0000000063, 52, 4, 1, 1, 'awwafawf', '2022-01-15 17:29:39'),
	(0000000064, 53, 4, 1, 1, 'tewtwet', '2022-01-15 17:31:21'),
	(0000000065, 54, 4, 1, 1, 'estset', '2022-01-15 17:35:48'),
	(0000000066, 55, 4, 1, 1, 'estetse', '2022-01-15 17:35:59'),
	(0000000067, 56, 4, 1, 1, 'ewtwett', '2022-01-15 21:45:49'),
	(0000000068, 57, 4, 1, 1, 'retert', '2022-01-15 21:56:45'),
	(0000000069, 58, 4, 1, 1, 'ewtwetewt', '2022-01-15 21:58:39'),
	(0000000070, 59, 4, 1, 1, 'tesfrestest', '2022-01-15 22:52:20'),
	(0000000071, 60, 4, 1, 1, 'etet', '2022-01-16 00:33:39'),
	(0000000072, 60, 4, 1, 1, 'testete', '2022-01-16 00:47:01'),
	(0000000073, 61, 4, 1, 1, 'etste', '2022-01-16 00:52:04'),
	(0000000074, 62, 4, 1, 1, 'testete', '2022-01-16 00:52:15'),
	(0000000075, 63, 4, 1, 1, 'teste', '2022-01-16 00:52:24'),
	(0000000076, 61, 4, 1, 1, '.', '2022-01-16 00:53:27'),
	(0000000077, 62, 4, 1, 1, '.', '2022-01-16 00:53:36'),
	(0000000078, 63, 4, 1, 1, '.', '2022-01-16 00:53:43'),
	(0000000079, 64, 4, 1, 1, 'teste', '2022-01-16 02:48:52'),
	(0000000080, 64, 4, 1, 1, 'te', '2022-01-17 21:42:44'),
	(0000000081, 64, 4, 1, 1, '.', '2022-01-17 21:46:30'),
	(0000000082, 64, 4, 1, 1, 'wadw', '2022-01-17 21:47:20'),
	(0000000083, 64, 4, 1, 1, 'rwadwd', '2022-01-17 21:49:51'),
	(0000000084, 64, 4, 1, 1, 'grdydry', '2022-01-17 21:50:35'),
	(0000000085, 53, 4, 1, 1, 'dbhjasdbajsdb', '2022-01-18 13:21:12'),
	(0000000086, 64, 4, 1, 1, '', '2022-01-18 17:41:54'),
	(0000000087, 65, 4, 1, 1, 'teste', '2022-01-18 20:09:19'),
	(0000000088, 75, 4, 1, 1, 'teste', '2022-01-18 20:39:27'),
	(0000000089, 76, 4, 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id metus nibh. Pellentesque porttitor, urna id sagittis feugiat, nunc lorem vestibulum metus, sit amet viverra nulla ex sed ipsum. Aliquam placerat gravida sem, in hendrerit dolor scelerisque cursus. Nam ornare arcu vel pretium facilisis. In hac habitasse platea dictumst. Vivamus ac arcu vitae arcu aliquam mattis. Phasellus ullamcorper ex orci, id maximus urna rhoncus vitae. Suspendisse ullamcorper dui ut ligula rutrum, et sagittis nisi consequat. Integer venenatis libero nec est viverra tristique. Curabitur lobortis, massa eget pharetra ullamcorper, urna metus molestie mauris, nec porttitor enim urna aliquam risus. Integer laoreet nisi non velit blandit, et pharetra urna ullamcorper. Suspendisse porta lectus sit amet ligula pharetra, in ornare magna mattis. Curabitur venenatis mauris eget enim scelerisque aliquet. Ut quis tempor leo, sed malesuada dolor.\r\n\r\nDonec finibus cursus luctus. Nam a sodales erat, eu porta nulla. Sed elit magna, v', '2022-01-18 20:41:07'),
	(0000000090, 77, 4, 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id metus nibh. Pellentesque porttitor, urna id sagittis feugiat, nunc lorem vestibulum metus, sit amet viverra nulla ex sed ipsum. Aliquam placerat gravida sem, in hendrerit dolor scelerisque cursus. Nam ornare arcu vel pretium facilisis. In hac habitasse platea dictumst. Vivamus ac arcu vitae arcu aliquam mattis. Phasellus ullamcorper ex orci, id maximus urna rhoncus vitae. Suspendisse ullamcorper dui ut ligula rutrum, et sagittis nisi consequat. Integer venenatis libero nec est viverra tristique. Curabitur lobortis, massa eget pharetra ullamcorper, urna metus molestie mauris, nec porttitor enim urna aliquam risus. Integer laoreet nisi non velit blandit, et pharetra urna ullamcorper. Suspendisse porta lectus sit amet ligula pharetra, in ornare magna mattis. Curabitur venenatis mauris eget enim scelerisque aliquet. Ut quis tempor leo, sed malesuada dolor.\r\n\r\nDonec finibus cursus luctus. Nam a sodales erat, eu porta nulla. Sed elit magna, v', '2022-01-18 20:41:13'),
	(0000000091, 77, 4, 1, 1, 'testestte', '2022-01-18 22:45:15'),
	(0000000092, 77, 4, 1, 3, 'teste', '2022-01-18 22:46:15'),
	(0000000093, 77, 4, 1, 3, 'teste', '2022-01-18 22:46:15'),
	(0000000094, 77, 4, 3, 1, '', '2022-01-18 22:47:07'),
	(0000000095, 77, 4, 1, 1, 'teste', '2022-01-19 19:07:37'),
	(0000000096, 77, 4, 1, 1, '', '2022-01-19 19:07:44'),
	(0000000097, 77, 4, 1, 1, 'teste', '2022-01-19 19:07:51'),
	(0000000098, 64, 4, 1, 3, 'yrdyr', '2022-01-19 23:23:34'),
	(0000000099, 78, 39, 8, 8, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas est elit, fringilla nec tincidunt et, bibendum id tortor. Quisque viverra dapibus commodo. Etiam lobortis lorem sed nunc commodo, nec maximus leo faucibus. Quisque placerat est odio, nec hendrerit orci vulputate non. Phasellus a odio eget est rutrum auctor ac id ante. Nullam euismod arcu ultricies mauris porttitor, ut ultrices lacus tristique. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras quis massa efficitur nisl consectetur convallis. Pellentesque vestibulum placerat felis, vel posuere eros consectetur ut.', '2022-01-19 23:30:43'),
	(0000000100, 78, 39, 8, 8, 'TEste', '2022-01-19 23:38:34'),
	(0000000101, 78, 39, 8, 8, 'te', '2022-01-19 23:38:48'),
	(0000000102, 78, 39, 8, 8, 'test', '2022-01-19 23:38:49'),
	(0000000103, 78, 39, 8, 8, 'test', '2022-01-19 23:38:51'),
	(0000000104, 78, 39, 8, 8, 't', '2022-01-19 23:38:55'),
	(0000000105, 78, 39, 8, 8, 't', '2022-01-19 23:38:56'),
	(0000000106, 78, 39, 8, 8, 't', '2022-01-19 23:38:58'),
	(0000000107, 78, 39, 8, 8, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas est elit, fringilla nec tincidunt et, bibendum id tortor. Quisque viverra dapibus commodo. Etiam lobortis lorem sed nunc commodo, nec maximus leo faucibus. Quisque placerat est odio, nec hendrerit orci vulputate non. Phasellus a odio eget est rutrum auctor ac id ante. Nullam euismod arcu ultricies mauris porttitor, ut ultrices lacus tristique. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras quis massa efficitur nisl consectetur convallis. Pellentesque vestibulum placerat felis, vel posuere eros consectetur ut.', '2022-01-19 23:39:10'),
	(0000000108, 64, 4, 3, 1, 'teste', '2022-01-20 17:20:26'),
	(0000000109, 64, 4, 1, 2, 'testet', '2022-01-20 17:33:57'),
	(0000000110, 64, 4, 2, 1, 'testeste', '2022-01-20 17:34:01'),
	(0000000111, 64, 4, 1, 1, 'teste', '2022-01-20 17:35:23'),
	(0000000112, 64, 4, 1, 1, 'ç', '2022-01-20 17:35:30'),
	(0000000113, 64, 4, 1, 3, 'gc', '2022-01-20 17:35:36'),
	(0000000114, 64, 4, 3, 1, '', '2022-01-20 18:11:24'),
	(0000000115, 64, 4, 1, 1, '', '2022-01-20 18:11:26'),
	(0000000116, 64, 4, 1, 1, '', '2022-01-20 18:11:27'),
	(0000000117, 79, 29, 9, 9, 'test', '2022-01-21 17:47:47'),
	(0000000118, 80, 51, 10, 10, 'dryy', '2022-01-21 19:49:35');
/*!40000 ALTER TABLE `tarefasrespostas` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.tarefastags
CREATE TABLE IF NOT EXISTS `tarefastags` (
  `idTarefasTags` int NOT NULL AUTO_INCREMENT,
  `idTarefa` int NOT NULL,
  `idTag` int NOT NULL,
  `idProjeto` int NOT NULL,
  PRIMARY KEY (`idTarefasTags`),
  KEY `idTarefa_idx` (`idTarefa`),
  KEY `idTag_ta_idx` (`idTag`),
  KEY `idProjeto_idx` (`idProjeto`),
  CONSTRAINT `idProjeto_tta` FOREIGN KEY (`idProjeto`) REFERENCES `projetos` (`idProjetos`),
  CONSTRAINT `idTag_ta` FOREIGN KEY (`idTag`) REFERENCES `tags` (`idTags`),
  CONSTRAINT `idTarefa_ta` FOREIGN KEY (`idTarefa`) REFERENCES `tarefas` (`idTarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.tarefastags: ~7 rows (aproximadamente)
/*!40000 ALTER TABLE `tarefastags` DISABLE KEYS */;
INSERT INTO `tarefastags` (`idTarefasTags`, `idTarefa`, `idTag`, `idProjeto`) VALUES
	(1, 64, 6, 1),
	(7, 64, 7, 1),
	(11, 78, 21, 32),
	(13, 64, 19, 1),
	(14, 64, 20, 1),
	(15, 64, 9, 1),
	(16, 64, 18, 1);
/*!40000 ALTER TABLE `tarefastags` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.tarefastempo
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.tarefastempo: ~26 rows (aproximadamente)
/*!40000 ALTER TABLE `tarefastempo` DISABLE KEYS */;
INSERT INTO `tarefastempo` (`idTarefasTempo`, `idTarefa`, `idColaborador`, `idStatus`, `dataInicio`, `dataFinal`) VALUES
	(1, 12, 4, 1, '2022-01-18 21:48:12', '2022-01-18 22:01:49'),
	(2, 12, 4, 1, '2022-01-18 21:48:32', '2022-01-18 22:01:49'),
	(3, 12, 4, 1, '2022-01-18 22:01:41', '2022-01-18 22:01:49'),
	(4, 12, 4, 1, '2022-01-18 22:02:26', '2022-01-18 22:02:30'),
	(5, 77, 4, 1, '2022-01-18 22:45:03', '2022-01-18 22:45:17'),
	(6, 77, 4, 3, '2022-01-18 22:46:16', '2022-01-18 22:46:18'),
	(7, 12, 4, 1, '2022-01-18 22:48:13', '2022-01-18 22:48:15'),
	(8, 12, 4, 1, '2022-01-18 22:51:37', '2022-01-18 22:51:38'),
	(9, 12, 4, 1, '2022-01-18 22:51:40', '2022-01-18 22:51:41'),
	(10, 12, 4, 1, '2022-01-18 23:05:42', '2022-01-18 23:05:44'),
	(11, 12, 4, 1, '2022-01-18 23:05:46', '2022-01-18 23:05:48'),
	(12, 12, 4, 1, '2022-01-18 23:05:50', '2022-01-18 23:05:52'),
	(13, 38, 4, 1, '2022-01-19 14:25:59', '2022-01-19 14:27:03'),
	(14, 38, 4, 1, '2022-01-19 14:27:05', '2022-01-19 14:27:09'),
	(15, 38, 4, 1, '2022-01-19 14:27:11', '2022-01-19 14:27:21'),
	(16, 38, 4, 1, '2022-01-19 14:27:26', '2022-01-19 14:27:28'),
	(17, 38, 4, 1, '2022-01-19 14:27:30', '2022-01-19 14:27:33'),
	(18, 38, 4, 1, '2022-01-19 14:27:36', '2022-01-19 14:27:42'),
	(19, 38, 4, 1, '2022-01-19 14:27:55', '2022-01-19 14:28:06'),
	(20, 77, 4, 1, '2022-01-19 19:07:43', '2022-01-19 19:07:53'),
	(21, 64, 4, 1, '2022-01-19 19:14:03', '2022-01-19 19:15:40'),
	(22, 64, 4, 1, '2022-01-19 19:15:43', '2022-01-19 19:15:45'),
	(23, 64, 4, 1, '2022-01-19 19:30:46', '2022-01-19 19:30:49'),
	(24, 64, 4, 1, '2022-01-19 19:31:05', '2022-01-19 19:31:07'),
	(25, 64, 4, 1, '2022-01-19 23:23:28', '2022-01-19 23:23:39'),
	(26, 78, 39, 8, '2022-01-19 23:39:45', '2022-01-19 23:39:47'),
	(27, 78, 39, 8, '2022-01-19 23:39:47', '2022-01-19 23:39:48');
/*!40000 ALTER TABLE `tarefastempo` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.topicos
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

-- Copiando dados para a tabela mydb.topicos: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `topicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `topicos` ENABLE KEYS */;

-- Copiando estrutura para tabela mydb.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuarios` int NOT NULL AUTO_INCREMENT,
  `nomeUsuario` varchar(60) NOT NULL,
  `dataNascimento` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(60) DEFAULT NULL,
  `cancelado` tinyint DEFAULT NULL,
  `dataCriacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dataAlteracao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUsuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela mydb.usuarios: ~11 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`idUsuarios`, `nomeUsuario`, `dataNascimento`, `email`, `senha`, `cancelado`, `dataCriacao`, `dataAlteracao`) VALUES
	(37, 'fadfasdfsa', '2004-02-12', 'teste@dsagd.vom', '12345', NULL, '2021-12-19 15:06:15', '2021-12-19 18:06:15'),
	(38, 'testet', '2004-02-12', 'asjhdsahdb@gmail.com', '12345', NULL, '2021-12-19 15:06:54', '2021-12-19 18:06:54'),
	(39, 'teste', '2004-02-12', 'hasvfdh@gmai.cw', '$2a$10$dZbc3Jb0yk4p7CJ31L0ZR.sdkWVimzGni88VGlx2vfOSmBC3yuDgG', NULL, '2021-12-19 16:11:52', '2021-12-19 19:11:52'),
	(40, 'ajdbshf', '2004-02-12', 'sdjfbafs@xn--gmai-3oa.com', '$2a$10$0hFLYczbNZXQclZKsV5cme4Yx6.oCoenA7mWChpfKZPfOGkaLdRxS', NULL, '2021-12-19 16:12:48', '2021-12-19 19:12:48'),
	(41, 'sjadf', '2004-02-12', 'asbdfh@v.com', '$2a$10$ScTgqHCnkMYkXH/bctWVMe8mjg6qsiwvJCKYq3Sf/eC813QiS8Ssa', NULL, '2021-12-19 16:14:14', '2021-12-19 19:14:14'),
	(42, 'Lucas Teste', '2004-11-13', 'b@b', '11111', NULL, '2021-12-19 17:00:22', '2022-01-21 02:53:47'),
	(43, 'teste', '2004-02-12', 'teste@gmailcads.com', '$2a$10$W/s3V6BTjefaQIfpM1d.h.C.5syQkcwvQbNQ2vd.TSls86JSA9q9e', NULL, '2022-01-11 23:10:40', '2022-01-12 02:10:40'),
	(44, 'teste', '2004-02-12', 'khavsd@gmai.com', '$2a$10$/EJLh4m6CthypYygaE6rG.owvAxHuHmnEGYdoQRUAPEOtZVdpiEQG', NULL, '2022-01-11 23:11:34', '2022-01-12 02:11:34'),
	(45, 'etste', '2004-02-12', 'asdbvkbfafb@fmail.com', '$2a$10$wc3bMoOWDO4IsPoYjfW5..u.C6SmTEROcx3PbGCkHcKd.fW8Txyam', NULL, '2022-01-11 23:11:59', '2022-01-12 02:11:59'),
	(46, 'Conta teste', '2004-02-12', 'lukantunes@gmail.com', '$2a$10$tBS1P3/w8WUI.wCEIdbY4ukzfbgaPCY.2ekUsyYJYi6ZFEi3v69rC', NULL, '2022-01-12 01:15:45', '2022-01-12 01:18:17'),
	(47, 'Conta teste', '2004-02-12', 'dads@gnas.com', '$2a$10$0knL/m9DwDK3g9Zg9x9gpe4Lj3e.kK9/8wuwwP3KZ3aejkeYo0K8G', NULL, '2022-01-12 01:18:39', '2022-01-19 20:47:46'),
	(48, 'Teste com senha', '2004-02-12', 'a@a', '$2a$10$fDVErhNfeU7iSsCQJHuLfelvvoWSUGzlmHivbKQyhUX5yyx6Iry9C', NULL, '2022-01-12 01:19:31', '2022-01-21 19:12:36'),
	(49, 'teste', '2004-02-12', 'lukasbuligntunes@gmail.com', 'abcde', NULL, '2022-01-20 15:26:45', '2022-01-20 23:57:10'),
	(50, 'teste fernando', '2004-02-12', 'fernando@t.teste', '$2a$10$0Hm/OzHmZQBkkWQOuLHEBuB7s78dbPjF7SoMV8viKXxubbGLsELVq', NULL, '2022-01-21 16:47:01', '2022-01-21 19:47:01');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
