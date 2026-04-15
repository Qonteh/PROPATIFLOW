-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2026 at 07:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rental_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `status` enum('pending','under_review','approved','rejected','withdrawn','expired') DEFAULT 'pending',
  `application_date` datetime DEFAULT current_timestamp(),
  `desired_move_in` date NOT NULL,
  `proposed_rent` decimal(12,2) DEFAULT NULL,
  `lease_duration_months` int(11) DEFAULT 12,
  `message` text DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `credit_score_shared` tinyint(1) DEFAULT 0,
  `background_check_consent` tinyint(1) DEFAULT 0,
  `income_verification_consent` tinyint(1) DEFAULT 0,
  `landlord_notes` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `reviewed_by` varchar(36) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `property_id`, `tenant_id`, `landlord_id`, `status`, `application_date`, `desired_move_in`, `proposed_rent`, `lease_duration_months`, `message`, `documents`, `credit_score_shared`, `background_check_consent`, `income_verification_consent`, `landlord_notes`, `rejection_reason`, `reviewed_at`, `reviewed_by`, `created_at`, `updated_at`) VALUES
('86ef02ea-a4d6-4f08-9a01-2c0b752868ef', 'f014ff7e-7722-49b1-ad63-72bea18f568f', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'approved', '2026-03-22 18:03:19', '0000-00-00', NULL, 12, '', NULL, 0, 0, 0, NULL, NULL, '2026-03-22 20:43:05', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', '2026-03-22 18:03:19', '2026-03-22 20:43:05'),
('918ce4ce-25b0-4317-b5be-633eb5326a03', 'f014ff7e-7722-49b1-ad63-72bea18f568f', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'under_review', '2026-03-22 17:59:40', '0000-00-00', NULL, 12, '', NULL, 0, 0, 0, NULL, NULL, '2026-03-22 20:40:24', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', '2026-03-22 17:59:40', '2026-03-22 20:40:24'),
('fad64d24-499c-4ce6-800b-6c6e555b1071', 'd8333370-9867-4157-8fb8-511a2073bc10', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'approved', '2026-03-22 22:26:28', '0000-00-00', NULL, 12, '', NULL, 0, 0, 0, NULL, NULL, '2026-03-22 22:38:03', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', '2026-03-22 22:26:28', '2026-03-22 22:38:03');

-- --------------------------------------------------------

--
-- Table structure for table `background_checks`
--

CREATE TABLE `background_checks` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `check_type` enum('criminal','eviction','employment','reference') NOT NULL,
  `status` enum('pending','in_progress','completed','failed') DEFAULT 'pending',
  `result` enum('clear','flagged','inconclusive') DEFAULT NULL,
  `details` text DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `provider_reference` varchar(100) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit_scores`
--

CREATE TABLE `credit_scores` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `total_score` int(11) NOT NULL,
  `payment_history_score` int(11) DEFAULT 0,
  `credit_utilization_score` int(11) DEFAULT 0,
  `credit_history_length_score` int(11) DEFAULT 0,
  `credit_mix_score` int(11) DEFAULT 0,
  `new_inquiries_score` int(11) DEFAULT 0,
  `score_rating` enum('excellent','good','fair','poor') NOT NULL,
  `last_updated` datetime DEFAULT current_timestamp(),
  `is_shared_with_landlord` tinyint(1) DEFAULT 0,
  `share_code` varchar(50) DEFAULT NULL,
  `share_code_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `document_type` enum('id_card','passport','drivers_license','utility_bill','bank_statement','employment_letter','pay_slip','lease_agreement','other') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verified_at` datetime DEFAULT NULL,
  `verified_by` varchar(36) DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `document_type`, `file_name`, `file_url`, `file_size`, `mime_type`, `is_verified`, `verified_at`, `verified_by`, `expires_at`, `created_at`) VALUES
('301872a0-7896-4f22-b637-a7246f7f2332', NULL, 'other', 'PropatiFlow TZ Logo (Graphic) (1).png', '/uploads/1774185568745-PropatiFlow-TZ-Logo-(Graphic)-(1).png', 96090, 'image/png', 0, NULL, NULL, NULL, '2026-03-22 16:19:28'),
('43f5299b-d288-4c6c-b9f5-a48d5884e52d', NULL, 'other', '9e032f28ae69242e8631f02ca5afbe17.mp4', '/uploads/1774188657800-9e032f28ae69242e8631f02ca5afbe17.mp4', 11395375, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 17:10:57'),
('5e418479-ec20-4e69-a6ff-d65754944992', NULL, 'other', '22e9afbb107fe92442d4a053ab3b2cee.mp4', '/uploads/1774188453730-22e9afbb107fe92442d4a053ab3b2cee.mp4', 4466148, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 17:07:33'),
('6d39ca26-a02b-49e9-a9aa-bfd76401781b', NULL, 'other', '1373ce4d859dd1475a11feab56d907de.mp4', '/uploads/1774188337749-1373ce4d859dd1475a11feab56d907de.mp4', 4558300, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 17:05:37'),
('71ae6784-d321-4569-b4aa-655e242d71a7', NULL, 'other', '678d9b28c6eb8a01bab960aa0a38fa1e.mp4', '/uploads/1774187703311-678d9b28c6eb8a01bab960aa0a38fa1e.mp4', 3779648, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 16:55:03'),
('ccafb2df-a679-45c0-b8be-9d36e91becac', NULL, 'other', 'd0e8e67d4662f14d5ad7024a0ad78a52.mp4', '/uploads/1774187144697-d0e8e67d4662f14d5ad7024a0ad78a52.mp4', 2538774, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 16:45:44'),
('d07a5ed9-45cd-4772-9d28-1bc56284a025', NULL, 'other', 'IMG-20240313-WA0015.jpg', '/uploads/1774188740459-IMG-20240313-WA0015.jpg', 97131, 'image/jpeg', 0, NULL, NULL, NULL, '2026-03-22 17:12:20'),
('defe9e64-90f5-4244-88fd-471d3a24f1a4', NULL, 'other', '678d9b28c6eb8a01bab960aa0a38fa1e.mp4', '/uploads/1774187428623-678d9b28c6eb8a01bab960aa0a38fa1e.mp4', 3779648, 'video/mp4', 0, NULL, NULL, NULL, '2026-03-22 16:50:28');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `property_id` varchar(36) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `expense_date` date NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `receipt_url` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leases`
--

CREATE TABLE `leases` (
  `id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `application_id` varchar(36) DEFAULT NULL,
  `status` enum('draft','pending_signature','active','expired','terminated','renewed') DEFAULT 'draft',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `rent_amount` decimal(12,2) NOT NULL,
  `security_deposit` decimal(12,2) DEFAULT NULL,
  `payment_due_day` int(11) DEFAULT 1,
  `late_fee_amount` decimal(10,2) DEFAULT 0.00,
  `late_fee_grace_days` int(11) DEFAULT 5,
  `terms_and_conditions` text DEFAULT NULL,
  `special_clauses` text DEFAULT NULL,
  `document_url` varchar(500) DEFAULT NULL,
  `signed_by_tenant` tinyint(1) DEFAULT 0,
  `tenant_signed_at` datetime DEFAULT NULL,
  `signed_by_landlord` tinyint(1) DEFAULT 0,
  `landlord_signed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('plumbing','electrical','appliance','hvac','structural','pest','cleaning','other') NOT NULL,
  `priority` enum('low','medium','high','emergency') DEFAULT 'medium',
  `status` enum('open','in_progress','scheduled','completed','cancelled') DEFAULT 'open',
  `images` text DEFAULT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `paid_by` enum('landlord','tenant','shared') DEFAULT NULL,
  `contractor_name` varchar(255) DEFAULT NULL,
  `contractor_phone` varchar(20) DEFAULT NULL,
  `landlord_notes` text DEFAULT NULL,
  `tenant_rating` int(11) DEFAULT NULL,
  `tenant_feedback` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(36) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `receiver_id` varchar(36) NOT NULL,
  `property_id` varchar(36) DEFAULT NULL,
  `application_id` varchar(36) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `type` enum('application','payment','maintenance','message','lease','verification','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `application_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `content`, `link`, `is_read`, `read_at`, `created_at`, `application_id`) VALUES
('33c48cb3-f107-49f3-8cc9-e93cd8d4dbbf', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'application', 'New Application', 'New rental application from JUMA ALLY for property HOUSE 5', NULL, 0, NULL, '2026-03-22 22:26:28', NULL),
('5f868b4b-7b5f-45be-acf3-3c17d04c1a68', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'application', 'Application Under Review', 'Your rental application is now being reviewed.', '/tenant/applications', 0, NULL, '2026-03-22 22:35:56', NULL),
('703e32ad-e41d-49fa-ac7b-9d468fd5e621', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'application', 'Application Approved!', 'Congratulations! Your rental application has been approved.', '/tenant/applications', 0, NULL, '2026-03-22 20:43:05', NULL),
('a72aef38-0b47-4d16-8c71-3312a0370739', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'application', 'Application Under Review', 'Your rental application is now being reviewed.', '/tenant/applications', 0, NULL, '2026-03-22 20:40:24', NULL),
('b99d25cc-a43d-428e-8a03-703273f3abe0', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'application', 'Application Approved!', 'Congratulations! Your rental application has been approved.', '/tenant/applications', 0, NULL, '2026-03-22 22:38:03', NULL),
('d33ddcd7-a537-4155-9b9e-b8d3293fc0fc', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'application', 'New Application', 'New rental application from AFRICAN DIGITAL MARKETING AGENCY for property HOUSE 4', NULL, 1, '2026-03-22 22:14:30', '2026-03-22 18:03:19', NULL),
('eb4a2127-6c29-4402-bc31-8c9f56f9fee5', '23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'application', 'Application Under Review', 'Your rental application is now being reviewed.', '/tenant/applications', 0, NULL, '2026-03-22 20:40:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification_settings`
--

CREATE TABLE `notification_settings` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `new_applications` tinyint(1) DEFAULT 1,
  `payment_reminders` tinyint(1) DEFAULT 1,
  `maintenance_requests` tinyint(1) DEFAULT 1,
  `monthly_reports` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(36) NOT NULL,
  `lease_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `payment_type` enum('rent','security_deposit','late_fee','utility','maintenance','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'TZS',
  `status` enum('pending','processing','completed','failed','refunded','cancelled') DEFAULT 'pending',
  `payment_method` enum('bank_transfer','card','cash','mobile_money','crypto') NOT NULL,
  `psp` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `paid_date` datetime DEFAULT NULL,
  `payment_period_start` date DEFAULT NULL,
  `payment_period_end` date DEFAULT NULL,
  `late_fee_applied` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `receipt_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_settings`
--

CREATE TABLE `payment_settings` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `mobile_money` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` varchar(36) NOT NULL,
  `landlord_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `property_type` enum('apartment','house','condo','studio','duplex','room','office','shop') NOT NULL,
  `status` enum('available','rented','maintenance','unavailable') DEFAULT 'available',
  `address` varchar(500) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) DEFAULT 'Tanzania',
  `zip_code` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT 1,
  `bathrooms` int(11) DEFAULT 1,
  `area_sqft` int(11) DEFAULT NULL,
  `rent_amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'TZS',
  `security_deposit` decimal(12,2) DEFAULT NULL,
  `is_furnished` tinyint(1) DEFAULT 0,
  `parking_spaces` int(11) DEFAULT 0,
  `amenities` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `extra_features` text DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `min_lease_months` int(11) DEFAULT 12,
  `pet_policy` enum('allowed','not_allowed','negotiable') DEFAULT 'not_allowed',
  `is_published` tinyint(1) DEFAULT 1,
  `views_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `media` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `landlord_id`, `title`, `description`, `property_type`, `status`, `address`, `city`, `state`, `country`, `zip_code`, `latitude`, `longitude`, `bedrooms`, `bathrooms`, `area_sqft`, `rent_amount`, `currency`, `security_deposit`, `is_furnished`, `parking_spaces`, `amenities`, `images`, `extra_features`, `video_url`, `available_from`, `min_lease_months`, `pet_policy`, `is_published`, `views_count`, `created_at`, `updated_at`, `media`) VALUES
('215e8eda-7fb6-4397-9e47-334487431d53', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'HOUSE 1', 'master room kali sanaa', 'house', 'available', 'kigamboni, kisiwani', 'dar-es-salaam', 'kigamboni', 'Tanzania', NULL, NULL, NULL, 1, 1, NULL, 150000.00, 'TZS', 1999.99, 0, 0, '[\"Parking\",\"Dishwasher\",\"Furnished\",\"Gym\",\"AC\",\"Pool\"]', NULL, NULL, NULL, NULL, 12, 'not_allowed', 1, 0, '2026-03-22 16:47:28', '2026-03-22 16:47:28', '[\"/uploads/1774187144697-d0e8e67d4662f14d5ad7024a0ad78a52.mp4\"]'),
('7ae485e3-b92f-41bb-a0c0-32249883e594', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'HOUSE 2', 'chumba master room, na jiko kubwa ndani, nyumba ipo ndani ya fensi', 'house', 'available', 'Chamazi', 'dar-es-salaam', 'chamazi, magengeni', 'Tanzania', NULL, NULL, NULL, 1, 1, 1200, 160000.00, 'TZS', 2000.00, 0, 0, '[\"Parking\",\"Dishwasher\",\"AC\",\"Gym\"]', NULL, NULL, NULL, '2026-03-22', 12, 'not_allowed', 1, 0, '2026-03-22 17:03:48', '2026-03-22 17:03:48', '[\"/uploads/1774187703311-678d9b28c6eb8a01bab960aa0a38fa1e.mp4\"]'),
('d53982a8-5917-4a9f-bb78-5e0653dfcc36', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'HOUSE 3', 'single room kali sanaaaa', 'house', 'available', 'Mbezi', 'dar-es-salaam', 'magufuli', 'Tanzania', NULL, NULL, NULL, 1, 1, 299, 45000.00, 'TZS', 1499.99, 0, 0, '[\"AC\"]', NULL, NULL, NULL, '2026-03-22', 12, 'not_allowed', 1, 0, '2026-03-22 17:05:40', '2026-03-22 17:05:40', '[\"/uploads/1774188337749-1373ce4d859dd1475a11feab56d907de.mp4\"]'),
('d8333370-9867-4157-8fb8-511a2073bc10', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'HOUSE 5', 'master kali sanaaaa ina kila kitu', 'house', 'rented', 'temeke', 'dar-es-salaam', 'temeke', 'Tanzania', NULL, NULL, NULL, 1, 1, 1300, 130000.00, 'TZS', 1499.99, 0, 0, '[\"Parking\"]', NULL, NULL, NULL, '2026-03-22', 12, 'not_allowed', 1, 6, '2026-03-22 17:11:00', '2026-03-22 22:38:03', '[\"/uploads/1774188657800-9e032f28ae69242e8631f02ca5afbe17.mp4\"]'),
('f014ff7e-7722-49b1-ad63-72bea18f568f', '43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'HOUSE 4', 'nyumba iliyokamilika', 'house', 'rented', 'kigamboni, darajani', 'dar-es-salaam', 'kigamboni', 'Tanzania', NULL, NULL, NULL, 2, 2, 1299, 180000.00, 'TZS', 1999.99, 0, 0, '[\"AC\",\"Gym\",\"Dishwasher\"]', NULL, NULL, NULL, '2026-03-22', 12, 'not_allowed', 1, 14, '2026-03-22 17:07:36', '2026-03-22 23:10:21', '[\"/uploads/1774188453730-22e9afbb107fe92442d4a053ab3b2cee.mp4\"]');

-- --------------------------------------------------------

--
-- Table structure for table `property_views`
--

CREATE TABLE `property_views` (
  `id` varchar(36) NOT NULL,
  `property_id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `viewed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_profiles`
--

CREATE TABLE `tenant_profiles` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `nida_number` varchar(30) DEFAULT NULL,
  `employer_name` varchar(255) DEFAULT NULL,
  `employment_status` enum('employed','self_employed','unemployed','student','retired') DEFAULT 'employed',
  `job_title` varchar(100) DEFAULT NULL,
  `annual_income` decimal(15,2) DEFAULT NULL,
  `income_verified` tinyint(1) DEFAULT 0,
  `employment_start_date` date DEFAULT NULL,
  `previous_landlord_name` varchar(255) DEFAULT NULL,
  `previous_landlord_phone` varchar(20) DEFAULT NULL,
  `previous_landlord_email` varchar(255) DEFAULT NULL,
  `previous_address` text DEFAULT NULL,
  `rental_history_years` int(11) DEFAULT 0,
  `has_pets` tinyint(1) DEFAULT 0,
  `pet_details` text DEFAULT NULL,
  `number_of_occupants` int(11) DEFAULT 1,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `emergency_contact_relationship` varchar(50) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('tenant','landlord','agent') NOT NULL DEFAULT 'tenant',
  `is_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `avatar_url` varchar(500) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Tanzania',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `role`, `is_verified`, `is_active`, `avatar_url`, `date_of_birth`, `address`, `city`, `state`, `country`, `created_at`, `updated_at`, `last_login`) VALUES
('23cffaef-b163-402d-a4b4-bb7c3b9f4f41', 'aishwaria@gmail.com', '$2b$10$uynaKO5CVx3/WBTgTXObUOHFirSTH310xRON4r18SdvcEcDDK8Zke', 'PAUL', 'NTIYAKUNZE NGULINZILA', '0714859891', 'tenant', 0, 1, '/uploads/1774188740459-IMG-20240313-WA0015.jpg', NULL, NULL, NULL, NULL, 'Tanzania', '2026-03-22 17:12:31', '2026-03-22 17:12:31', NULL),
('43f43baa-8cc9-468b-be2f-4f13d8aa39fa', 'qontetina@gmail.com', '$2b$10$8TKLm.Ozayo3zHVf5U2e1O.EO5luJELqgaeHWgyb8S7QxSsjYOoD2', 'ABDUL', 'SALUMU', '0692438585', 'landlord', 0, 1, '/uploads/1774185568745-PropatiFlow-TZ-Logo-(Graphic)-(1).png', NULL, NULL, NULL, NULL, 'Tanzania', '2026-03-22 16:19:42', '2026-03-22 16:19:42', NULL),
('a29e5364-0637-4616-81dd-83e7c505b5cf', 'tenant@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'Demo', 'Tenant', '+255987654321', 'tenant', 1, 1, NULL, NULL, NULL, NULL, NULL, 'Tanzania', '2026-03-22 16:15:47', '2026-03-22 16:15:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verifications`
--

CREATE TABLE `verifications` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `nin_number` varchar(20) DEFAULT NULL,
  `nin_verified` tinyint(1) DEFAULT 0,
  `nin_verified_at` datetime DEFAULT NULL,
  `bvn_number` varchar(20) DEFAULT NULL,
  `bvn_verified` tinyint(1) DEFAULT 0,
  `bvn_verified_at` datetime DEFAULT NULL,
  `id_document_url` varchar(500) DEFAULT NULL,
  `id_document_type` enum('national_id','passport','drivers_license','voters_card') DEFAULT NULL,
  `id_verified` tinyint(1) DEFAULT 0,
  `id_verified_at` datetime DEFAULT NULL,
  `selfie_url` varchar(500) DEFAULT NULL,
  `selfie_verified` tinyint(1) DEFAULT 0,
  `address_verified` tinyint(1) DEFAULT 0,
  `address_document_url` varchar(500) DEFAULT NULL,
  `verification_status` enum('pending','in_progress','verified','rejected') DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_landlord` (`landlord_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `background_checks`
--
ALTER TABLE `background_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_type` (`check_type`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `credit_scores`
--
ALTER TABLE `credit_scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_credit` (`user_id`),
  ADD UNIQUE KEY `share_code` (`share_code`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_type` (`document_type`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_landlord` (`landlord_id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_date` (`expense_date`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`property_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `leases`
--
ALTER TABLE `leases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `landlord_id` (`landlord_id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `landlord_id` (`landlord_id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_receiver` (`receiver_id`),
  ADD KEY `idx_read` (`is_read`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_notif` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_reference` (`payment_reference`),
  ADD KEY `landlord_id` (`landlord_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `idx_lease` (`lease_id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_due_date` (`due_date`);

--
-- Indexes for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_payment` (`user_id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_landlord` (`landlord_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_rent` (`rent_amount`),
  ADD KEY `idx_type` (`property_type`);

--
-- Indexes for table `property_views`
--
ALTER TABLE `property_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_viewed_at` (`viewed_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `tenant_profiles`
--
ALTER TABLE `tenant_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_tenant_profile` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_verification` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notification_settings`
--
ALTER TABLE `notification_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_settings`
--
ALTER TABLE `payment_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `background_checks`
--
ALTER TABLE `background_checks`
  ADD CONSTRAINT `background_checks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `credit_scores`
--
ALTER TABLE `credit_scores`
  ADD CONSTRAINT `credit_scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leases`
--
ALTER TABLE `leases`
  ADD CONSTRAINT `leases_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leases_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leases_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leases_ibfk_4` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_requests_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_requests_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD CONSTRAINT `notification_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_4` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD CONSTRAINT `payment_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_views`
--
ALTER TABLE `property_views`
  ADD CONSTRAINT `property_views_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_views_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_profiles`
--
ALTER TABLE `tenant_profiles`
  ADD CONSTRAINT `tenant_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `verifications`
--
ALTER TABLE `verifications`
  ADD CONSTRAINT `verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
