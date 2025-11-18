-- Create Database
CREATE DATABASE IF NOT EXISTS EventEase;
USE EventEase;
-- TABLE: PostalArea

CREATE TABLE PostalArea (
    PostalCode VARCHAR(10) PRIMARY KEY,
    City       VARCHAR(100) NOT NULL
);

-- TABLE: User
CREATE TABLE User (
    UserID      INT AUTO_INCREMENT,
    Username    VARCHAR(50) NOT NULL,
    Email       VARCHAR(100) NOT NULL,
    Password    VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20),
    VIP         BOOLEAN DEFAULT FALSE,
    PostalCode  VARCHAR(10),

    PRIMARY KEY (UserID),
    UNIQUE (Username),
    UNIQUE (Email),
    FOREIGN KEY (PostalCode) REFERENCES PostalArea(PostalCode)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- TABLE: Administrator
CREATE TABLE Administrator (
    AdminID     INT AUTO_INCREMENT,
    Username    VARCHAR(50) NOT NULL,
    Email       VARCHAR(100) NOT NULL,
    Password    VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20),
    Role        VARCHAR(50),

    PRIMARY KEY (AdminID),
    UNIQUE (Username),
    UNIQUE (Email)
);

-- TABLE: Event

CREATE TABLE Event (
    EventID     INT AUTO_INCREMENT,
    Title       VARCHAR(200) NOT NULL,
    Category    VARCHAR(100),
    Date        DATE NOT NULL,
    BasePrice   DECIMAL(8,2),
    Description TEXT,
    Location    VARCHAR(200),
    AdminID     INT,

    PRIMARY KEY (EventID),
    FOREIGN KEY (AdminID) REFERENCES Administrator(AdminID)
);

-- TABLE: Wishlist 
CREATE TABLE Wishlist (
    UserID     INT,
    EventID    INT,
    DateAdded  DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Event(EventID)
        ON DELETE CASCADE
);
-- TABLE: Ticket
CREATE TABLE Ticket (
    TicketID   INT AUTO_INCREMENT,
    EventID    INT NOT NULL,
    UserID     INT NOT NULL,
    SeatNumber VARCHAR(10) NOT NULL,
    Price      DECIMAL(8,2),

    PRIMARY KEY (TicketID),
    UNIQUE (EventID, SeatNumber),
    FOREIGN KEY (EventID) REFERENCES Event(EventID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- TABLE: Payment
CREATE TABLE Payment (
    PaymentID   INT AUTO_INCREMENT,
    Amount      DECIMAL(8,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentType VARCHAR(50),
    UserID      INT NOT NULL,
    EventID     INT NOT NULL,

    PRIMARY KEY (PaymentID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID)
);

-- TABLE: DiscussionBoard
CREATE TABLE DiscussionBoard (
    DiscussionID INT AUTO_INCREMENT,
    Title        VARCHAR(200) NOT NULL,
    Content      TEXT NOT NULL,
    PostDate     DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserID       INT NOT NULL,
    EventID      INT NOT NULL,

    PRIMARY KEY (DiscussionID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID)
);


-- TABLE: Reply 
CREATE TABLE Reply (
    ReplyID        INT AUTO_INCREMENT,
    DiscussionID   INT NOT NULL,
    UserID         INT NOT NULL,
    ParentReplyID  INT NULL,
    Content        TEXT NOT NULL,
    ReplyDate      DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ReplyID),
    FOREIGN KEY (DiscussionID) REFERENCES DiscussionBoard(DiscussionID)
        ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ParentReplyID) REFERENCES Reply(ReplyID)
        ON DELETE SET NULL
);

-- TABLE: Report
CREATE TABLE Report (
    ReportID INT AUTO_INCREMENT,
    AdminID  INT NOT NULL,
    EventID  INT NOT NULL,
    UserID   INT NOT NULL,

    PRIMARY KEY (ReportID),
    FOREIGN KEY (AdminID) REFERENCES Administrator(AdminID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);
