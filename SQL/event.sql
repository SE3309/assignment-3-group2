CREATE DATABASE EventEase;
USE EventEase;

USE EventEase;


CREATE TABLE IF NOT EXISTS Event (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    EventDate DATE NOT NULL,
    BasePrice DECIMAL(10,2) NOT NULL,
    Description TEXT,
    Location VARCHAR(100),
    AdminID INT NOT NULL
    -- FOREIGN KEY (AdminID) REFERENCES Administrator(ID)
    --     ON DELETE CASCADE
    --     ON UPDATE CASCADE
);

