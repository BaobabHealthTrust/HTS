INSERT INTO role (role, description, uuid) VALUES ("Counselor", "HTS Counselor role", (SELECT UUID())), ("HTS Coordinator", "HTS Clinic Supervisor role", (SELECT UUID())), ("Admin", "HTS System Administrator role", (SELECT UUID()));

START TRANSACTION;

SELECT user_id INTO @user_id FROM users WHERE username = 'admin';

DELETE FROM user_role WHERE user_id = @user_id;

INSERT INTO user_role VALUES (@user_id, "Admin"), (@user_id, "HTS Focal Person"), (@user_id, "Counselor");

COMMIT;
