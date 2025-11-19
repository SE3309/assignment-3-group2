USE EventEase;
SELECT Username, Email, VIP
FROM user
LIMIT 5;

SELECT u.Username, t.EventID, t.SeatNumber, t.Price
FROM ticket t
JOIN user u ON t.UserID = u.UserID
LIMIT 5;

SELECT e.Title, e.Category, e.Date, d.Title AS DiscussionTitle
FROM event e
JOIN discussionboard d ON e.EventID = d.EventID
WHERE e.Category = 'Music'
LIMIT 5;

SELECT EventID, COUNT(*) AS TicketCount
FROM ticket
GROUP BY EventID
ORDER BY TicketCount DESC
LIMIT 5;

SELECT Username, Email
FROM user
WHERE UserID IN (
    SELECT UserID
    FROM wishlist
)
LIMIT 5;

SELECT u.Username, u.Email
FROM user u
WHERE EXISTS (
    SELECT 1
    FROM payment p
    WHERE p.UserID = u.UserID
)
LIMIT 5;

SELECT r1.ReplyID AS ChildReply,
       r1.Content AS ChildContent,
       r2.ReplyID AS ParentReply,
       r2.Content AS ParentContent
FROM reply r1
JOIN reply r2 ON r1.ParentReplyID = r2.ReplyID
LIMIT 5;

SELECT e.EventID, e.Title, COUNT(t.TicketID) AS TicketsSold
FROM event e
JOIN ticket t ON e.EventID = t.EventID
GROUP BY e.EventID, e.Title
HAVING COUNT(t.TicketID) > 5
LIMIT 5;

SELECT u.UserID, u.Username, u.Email
FROM user u
WHERE u.UserID IN (
    SELECT r.UserID
    FROM reply r
    WHERE EXISTS (
        SELECT 1
        FROM discussionboard d
        JOIN ticket t ON d.EventID = t.EventID
        WHERE d.DiscussionID = r.DiscussionID
          AND t.UserID = r.UserID
    )
)
LIMIT 5;
