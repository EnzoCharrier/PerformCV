-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `motDePasse` VARCHAR(255) NOT NULL,
    `role` ENUM('ETUDIANT', 'ADMIN') NOT NULL DEFAULT 'ETUDIANT',
    `classe` VARCHAR(50) NULL,
    `anneeBTS` INTEGER NULL,
    `service` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modele` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `apercu` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CV` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(150) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateModification` DATETIME(3) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT false,
    `idEtudiant` INTEGER NOT NULL,
    `idModele` INTEGER NULL,

    INDEX `CV_idEtudiant_idx`(`idEtudiant`),
    INDEX `CV_idModele_idx`(`idModele`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poste` VARCHAR(100) NOT NULL,
    `entreprise` VARCHAR(100) NOT NULL,
    `dateDebut` DATE NOT NULL,
    `dateFin` DATE NULL,
    `description` TEXT NULL,
    `idCV` INTEGER NOT NULL,

    INDEX `Experience_idCV_idx`(`idCV`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Formation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diplome` VARCHAR(150) NOT NULL,
    `etablissement` VARCHAR(150) NOT NULL,
    `anneeObtention` INTEGER NULL,
    `idCV` INTEGER NOT NULL,

    INDEX `Formation_idCV_idx`(`idCV`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Competence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `niveau` VARCHAR(50) NULL,
    `idCV` INTEGER NOT NULL,

    INDEX `Competence_idCV_idx`(`idCV`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commentaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenu` TEXT NOT NULL,
    `dateAjout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idAdministrateur` INTEGER NOT NULL,
    `idCV` INTEGER NOT NULL,

    INDEX `Commentaire_idAdministrateur_idx`(`idAdministrateur`),
    INDEX `Commentaire_idCV_idx`(`idCV`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RechercheStage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entreprise` VARCHAR(150) NOT NULL,
    `poste` VARCHAR(150) NULL,
    `dateEnvoi` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `statut` ENUM('ENVOYEE', 'RELANCEE', 'ENTRETIEN', 'ACCEPTEE', 'REFUSEE') NOT NULL DEFAULT 'ENVOYEE',
    `notes` TEXT NULL,
    `idEtudiant` INTEGER NOT NULL,

    INDEX `RechercheStage_idEtudiant_idx`(`idEtudiant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CV` ADD CONSTRAINT `CV_idEtudiant_fkey` FOREIGN KEY (`idEtudiant`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CV` ADD CONSTRAINT `CV_idModele_fkey` FOREIGN KEY (`idModele`) REFERENCES `Modele`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_idCV_fkey` FOREIGN KEY (`idCV`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Formation` ADD CONSTRAINT `Formation_idCV_fkey` FOREIGN KEY (`idCV`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competence` ADD CONSTRAINT `Competence_idCV_fkey` FOREIGN KEY (`idCV`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_idAdministrateur_fkey` FOREIGN KEY (`idAdministrateur`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_idCV_fkey` FOREIGN KEY (`idCV`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RechercheStage` ADD CONSTRAINT `RechercheStage_idEtudiant_fkey` FOREIGN KEY (`idEtudiant`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
