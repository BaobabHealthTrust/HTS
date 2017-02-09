INSERT INTO location_tag (name, description, creator, date_created, uuid) 
VALUES ("HTS", "HTS Locations", (SELECT user_id FROM users WHERE username = 
	'admin'), NOW(), (SELECT UUID()));
	
INSERT INTO location (name, description, creator, date_created, uuid) VALUES 
("Room 1", "HTS location", (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID())),
("Room 2", "HTS location", (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID())),
("Room 3", "HTS location", (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID())),
("Room 4", "HTS location", (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID()));

INSERT INTO location_tag_map (location_id, location_tag_id) SELECT location_id, (SELECT location_tag_id FROM 
	location_tag WHERE name = 'HTS') FROM location WHERE description = 'HTS location';

INSERT INTO role (role, description, uuid) VALUES ('Supervisor', 'User with supervisory role', (SELECT UUID()));

