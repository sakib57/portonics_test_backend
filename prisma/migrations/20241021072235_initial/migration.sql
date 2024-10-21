-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(255) NOT NULL,
    `customerEmail` VARCHAR(255) NOT NULL,
    `customerPhone` VARCHAR(255) NOT NULL,
    `customerAddress` VARCHAR(255) NOT NULL,
    `amount` INTEGER NOT NULL,
    `productName` VARCHAR(255) NOT NULL,
    `productDetails` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Order_customerEmail_key`(`customerEmail`),
    UNIQUE INDEX `Order_customerPhone_key`(`customerPhone`),
    UNIQUE INDEX `Order_customerAddress_key`(`customerAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
