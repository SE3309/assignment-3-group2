USE EventEase;

INSERT INTO wishlist (UserID, EventID, DateAdded)
SELECT DISTINCT t.UserID, t.EventID, NOW()
FROM ticket t
JOIN event e ON t.EventID = e.EventID
WHERE e.Category = 'Music'
LIMIT 10;

UPDATE user
SET VIP = TRUE
WHERE UserID IN (
    SELECT UserID
    FROM payment
    WHERE Amount > 200
);

DELETE FROM reply
WHERE DiscussionID IN (
    SELECT d.DiscussionID
    FROM discussionboard d
    LEFT JOIN ticket t ON d.EventID = t.EventID
    WHERE t.TicketID IS NULL
);
