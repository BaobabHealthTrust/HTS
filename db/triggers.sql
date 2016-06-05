DELIMITER $$

DROP TRIGGER IF EXISTS new_receipt$$

DROP TRIGGER IF EXISTS receipt_update$$

DROP TRIGGER IF EXISTS new_dispatch$$

DROP TRIGGER IF EXISTS dispatch_update$$

DROP TRIGGER IF EXISTS new_transfer$$

DROP TRIGGER IF EXISTS transfer_update$$

DROP TRIGGER IF EXISTS new_stock$$

DROP TRIGGER IF EXISTS stock_update$$

DROP TRIGGER IF EXISTS new_consumption$$

DROP TRIGGER IF EXISTS consumption_update$$

CREATE TRIGGER new_receipt 
AFTER INSERT ON `receipt` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, item_name, receipt_id, batch_number, expiry_date, receipt_quantity, receipt_datetime, receipt_who_received)
	VALUES (NEW.stock_id, (SELECT name FROM stock WHERE stock_id = NEW.stock_id), NEW.receipt_id, NEW.batch_number, NEW.expiry_date, NEW.receipt_quantity, NEW.receipt_datetime, NEW.receipt_who_received);

	UPDATE stock SET last_order_size = NEW.receipt_quantity WHERE stock_id = NEW.stock_id;

END$$

CREATE TRIGGER receipt_update
AFTER UPDATE ON `receipt` FOR EACH ROW
BEGIN

	UPDATE report SET batch_number = NEW.batch_number, expiry_date = NEW.expiry_date, receipt_quantity = NEW.receipt_quantity, receipt_datetime = NEW.receipt_datetime, receipt_who_received = NEW.receipt_who_received, voided = NEW.voided, date_voided = NEW.date_voided WHERE receipt_id = NEW.receipt_id;

	UPDATE stock SET last_order_size = NEW.receipt_quantity WHERE stock_id = NEW.stock_id;

END$$

CREATE TRIGGER new_dispatch 
AFTER INSERT ON `dispatch` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, item_name, batch_number, dispatch_id, dispatch_quantity, dispatch_datetime, dispatch_who_dispatched, dispatch_who_received, dispatch_who_authorised, dispatch_destination)
	VALUES (NEW.stock_id, (SELECT name FROM stock WHERE stock_id = NEW.stock_id), NEW.batch_number, NEW.dispatch_id, NEW.dispatch_quantity, NEW.dispatch_datetime, NEW.dispatch_who_dispatched, NEW.dispatch_who_received, NEW.dispatch_who_authorised, NEW.dispatch_destination);

END$$

CREATE TRIGGER dispatch_update
AFTER UPDATE ON `dispatch` FOR EACH ROW
BEGIN

	UPDATE report SET batch_number = NEW.batch_number, dispatch_quantity = NEW.dispatch_quantity, dispatch_datetime = NEW.dispatch_datetime, dispatch_who_dispatched = NEW.dispatch_who_dispatched, dispatch_who_received = NEW.dispatch_who_received, dispatch_who_authorised = NEW.dispatch_who_authorised, dispatch_destination = NEW.dispatch_destination, voided = NEW.voided, date_voided = NEW.date_voided WHERE dispatch_id = NEW.dispatch_id;

END$$

CREATE TRIGGER new_transfer 
AFTER INSERT ON `transfer` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, transfer_id, transfer_dispatch_id, transfer_quantity, transfer_who_transfered, transfer_who_received, transfer_who_authorised, transfer_destination, transfer_datetime)
	VALUES ((SELECT stock.stock_id FROM stock LEFT OUTER JOIN dispatch ON stock.stock_id = dispatch.stock_id WHERE dispatch_id = NEW.dispatch_id LIMIT 1), NEW.transfer_id, NEW.dispatch_id, NEW.transfer_quantity, NEW.transfer_who_transfered, NEW.transfer_who_received, NEW.transfer_who_authorised, NEW.transfer_destination, NEW.transfer_datetime);

END$$

CREATE TRIGGER transfer_update
AFTER UPDATE ON `transfer` FOR EACH ROW
BEGIN

	UPDATE report SET stock_id = (SELECT stock.stock_id FROM stock LEFT OUTER JOIN dispatch ON stock.stock_id = dispatch.stock_id WHERE dispatch_id = NEW.dispatch_id LIMIT 1), transfer_dispatch_id = NEW.dispatch_id, transfer_quantity = NEW.transfer_quantity, transfer_who_transfered = NEW.transfer_who_transfered, transfer_who_received = NEW.transfer_who_received, transfer_who_authorised = NEW.transfer_who_authorised, transfer_destination = NEW.transfer_destination, transfer_datetime = NEW.transfer_datetime, voided = NEW.voided, date_voided = NEW.date_voided WHERE transfer_id = NEW.transfer_id;

END$$

CREATE TRIGGER new_stock 
AFTER INSERT ON `stock` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, item_name, reorder_level, category_name)
	VALUES (NEW.stock_id, NEW.name, NEW.reorder_level, (SELECT name FROM category 
		WHERE category_id = NEW.category_id));

END$$

CREATE TRIGGER stock_update
AFTER UPDATE ON `stock` FOR EACH ROW
BEGIN

	UPDATE report SET item_name = NEW.name, reorder_level = NEW.reorder_level, 
		category_name = (SELECT name FROM category 
		WHERE category_id = NEW.category_id) WHERE stock_id = NEW.stock_id;

END$$

CREATE TRIGGER new_consumption 
AFTER INSERT ON `consumption` FOR EACH ROW
BEGIN

	INSERT report (stock_id, item_name, batch_number, consumption_id, consumption_type, who_consumed, 
			consumption_location, consumption_quantity, date_consumed, dispatch_id)
	VALUES(
			(SELECT stock_id FROM dispatch WHERE dispatch_id = NEW.dispatch_id),
			(SELECT name FROM stock LEFT OUTER JOIN dispatch ON dispatch.stock_id = 
						stock.stock_id WHERE dispatch_id = NEW.dispatch_id),
			(SELECT batch_number FROM dispatch WHERE dispatch_id = NEW.dispatch_id),
			NEW.consumption_id,
			(SELECT name FROM consumption_type WHERE consumption_type_id = NEW.consumption_type_id),
			NEW.who_consumed,
			NEW.location,
			NEW.consumption_quantity,
			NEW.date_consumed,
			NEW.dispatch_id
	);

END$$

CREATE TRIGGER consumption_update
AFTER UPDATE ON `consumption` FOR EACH ROW
BEGIN

	UPDATE report SET batch_number = (SELECT batch_number FROM dispatch WHERE 
		dispatch_id = NEW.dispatch_id), dispatch_id = NEW.dispatch_id, 
		consumption_type = (SELECT name FROM consumption_type WHERE 
		consumption_type_id = NEW.consumption_type_id), who_consumed = NEW.who_consumed, 
		consumption_location = NEW.location, consumption_quantity = NEW.consumption_quantity,
		date_consumed = NEW.date_consumed WHERE consumption_id = NEW.consumption_id;

END$$

DELIMITER ;
