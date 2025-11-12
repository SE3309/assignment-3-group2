CREATE TABLE Ticket (
	Ticket_ID INT AUTO_INCREMENT,	
    Event_ID INT,
	User_ID INT,
    Seat_Number VARCHAR(5) NOT NULL,
    Price VARCHAR(5) NOT NULL,
    PRIMARY KEY(Ticket_ID),
    FOREIGN KEY (Event_ID) References Event(Event_ID),
    FOREIGN KEY (User_ID) References User(User_ID)
);