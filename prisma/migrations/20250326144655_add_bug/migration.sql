-- CreateTable
CREATE TABLE `Bug` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` ENUM('Crash', 'UiIssue', 'Performance', 'FeatureNotWorking', 'Other') NOT NULL,
    `deviceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bug` ADD CONSTRAINT `Bug_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `DeviceInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
