INSERT INTO administrator (Username, Email, Password, PhoneNumber, Role)
VALUES ('adminJohn', 'john.admin@example.com', 'adminpass', '519-222-1111', 'Manager');

INSERT INTO administrator 
SET Username='superAdmin',
    Email='super.admin@example.com',
    Password='superpass',
    PhoneNumber='226-444-7777',
    Role='Supervisor';

INSERT INTO administrator (Username, Email, Password, PhoneNumber, Role)
SELECT 
    'cloneAdmin',
    'clone.admin@example.com',
    'clonepass',
    '647-555-8888',
    Role      
FROM administrator
WHERE Username = 'adminJohn';

