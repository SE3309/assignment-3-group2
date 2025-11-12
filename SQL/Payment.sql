CREATE DATABASE IF NOT EXISTS EventEase;
USE EventEase;
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,      
    UserID INT NOT NULL,                       
    EventID INT NOT NULL,                          
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0), 
    PaymentDate DATE DEFAULT (CURRENT_DATE),       
    PaymentType VARCHAR(30) NOT NULL,              

    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (EventID) REFERENCES Event(EventID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);