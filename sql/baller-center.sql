-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 12 nov. 2024 à 13:46
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `baller-center`
--

-- --------------------------------------------------------

--
-- Structure de la table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `brands`
--

INSERT INTO `brands` (`id`, `name`) VALUES
(1, 'Nike');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Maillot');

-- --------------------------------------------------------

--
-- Structure de la table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`products`)),
  `delivery_status` varchar(10) NOT NULL DEFAULT 'en cours',
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `total_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `deliveries`
--

INSERT INTO `deliveries` (`id`, `user`, `address`, `products`, `delivery_status`, `created_at`, `total_price`) VALUES
(2, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 1, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}, {\\\"id\\\" : 2, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}, {\\\"id\\\" : 3, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'en cours', '2024-11-12', 36000),
(3, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 1, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 2}]\"', 'en cours', '2024-11-12', 24000),
(4, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 2, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'en cours', '2024-10-12', 12000),
(5, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 3, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'en cours', '2024-11-12', 12000),
(6, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 1, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'en cours', '2024-10-12', 12000),
(7, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 2, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'en cours', '2024-11-12', 12000),
(8, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 3, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 1}]\"', 'Livrée', '2024-09-12', 12000),
(9, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 1, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 5}]\"', 'en cours', '2024-11-12', 60000),
(10, 2, '8 rue de l\'adresse 90123', '\"[{\\\"id\\\" : 2, \\\"name\\\" : \\\"Maillot des Raptors Domicile\\\", \\\"price\\\": 12000, \\\"quantity\\\" : 2}]\"', 'en cours', '2024-11-12', 24000);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` int(11) NOT NULL,
  `team` int(11) NOT NULL,
  `variation` varchar(255) NOT NULL,
  `brand` int(11) NOT NULL,
  `creation_year` year(4) NOT NULL,
  `size` varchar(10) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `sold` int(11) NOT NULL DEFAULT 0,
  `filename` text NOT NULL,
  `filepath` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category`, `team`, `variation`, `brand`, `creation_year`, `size`, `price`, `quantity`, `sold`, `filename`, `filepath`) VALUES
(1, 'Maillot raptor', 'Un maillot de l\'équipe des Raptors', 1, 1, 'Domicile', 1, '2020', '2XL', 12000, 23, 1, 'test.jpg', 'uploads\\test.jpg'),
(2, 'Maillot raptor', 'Un maillot de l\'équipe des Raptors', 1, 1, 'Extérieur', 1, '2020', '2XL', 12000, 21, 3, 'test.jpg', 'uploads\\test.jpg'),
(3, 'Maillot raptor', 'Un maillot de l\'équipe des Raptors', 1, 1, 'Alternative', 1, '2020', '2XL', 12000, 23, 1, 'test.jpg', 'uploads\\test.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` varchar(5) NOT NULL DEFAULT 'user',
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `telephone` varchar(13) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zipcode` varchar(5) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `role`, `firstname`, `lastname`, `email`, `password`, `telephone`, `address`, `zipcode`, `created_at`) VALUES
(1, 'admin', 'Aïcha', 'Dmin', 'admin@baller-center.com', '$2b$10$eAu7eqquNnQQNqRlR0n9H./LTmSKt8vF4WTSSXdQKwDGazsG9.yES', '0033601234567', '8 rue de l\'adresse', '90123', '2024-11-12 08:00:41'),
(2, 'user', 'Ursula', 'Ser', 'u.Ser@gmail.com', '$2b$10$J9heFdJUMq36q5gZFz6l2.DGiVAb1gcDzNZ7Db9X.Dudj4h.EfyRO', '003300000001', '8 rue de l\'adresse bis', '90123', '2024-11-12 09:16:31');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
