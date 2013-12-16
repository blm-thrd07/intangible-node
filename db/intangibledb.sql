SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `intangibledb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `intangibledb` ;

-- -----------------------------------------------------
-- Table `intangibledb`.`tbl_users`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `intangibledb`.`tbl_users` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `nombre` VARCHAR(30) NOT NULL ,
  `apellido` VARCHAR(30) NOT NULL ,
  `email` VARCHAR(45) NOT NULL ,
  `password` VARCHAR(50) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

