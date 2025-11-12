CREATE DATABASE EventEase;
USE EventEase;

CREATE TABLE Administrator (
    admin_id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff')),
    phone_number VARCHAR(15),
    PRIMARY KEY (admin_id)
);
