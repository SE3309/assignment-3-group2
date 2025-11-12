CREATE DATABASE EventEase;
USE EventEase;

-- USER table
CREATE TABLE User (
    UserID INT PRIMARY KEY,
    UserEmail VARCHAR(255) UNIQUE NOT NULL
);

-- WISHLIST table
CREATE TABLE Wishlist (
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    DateAdded DATE,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);
