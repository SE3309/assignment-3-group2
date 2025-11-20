CREATE VIEW vip_payment_summary AS
SELECT 
    u.UserID,
    u.Username,
    u.Email,
    p.Amount,
    p.PaymentDate,
    p.PaymentType,
    p.EventID
FROM user u
JOIN payment p ON u.UserID = p.UserID
WHERE u.VIP = TRUE;

SELECT * 
FROM vip_payment_summary
LIMIT 5;

INSERT INTO vip_payment_summary 
(UserID, Username, Email, Amount, PaymentDate, PaymentType, EventID)
VALUES (9999, 'fakevip', 'fake@example.com', 150.00, '2025-11-01', 'Cash', 10);

CREATE VIEW event_ticket_stats AS
SELECT 
    e.EventID,
    e.Title,
    e.Category,
    COUNT(t.TicketID) AS TicketsSold
FROM event e
LEFT JOIN ticket t ON e.EventID = t.EventID
GROUP BY e.EventID, e.Title, e.Category;

SELECT *
FROM event_ticket_stats
ORDER BY TicketsSold DESC
LIMIT 5;

INSERT INTO event_ticket_stats (EventID, Title, Category, TicketsSold)
VALUES (5000, 'New Event', 'Music', 10);
