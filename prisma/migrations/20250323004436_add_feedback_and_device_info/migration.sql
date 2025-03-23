-- CreateTable
CREATE TABLE `DeviceInfo` (
    `id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `version` VARCHAR(191) NULL,
    `manufacturer` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `rating` INTEGER NULL,
    `category` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `DeviceInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
