DELIMITER $$

DROP TRIGGER IF EXISTS new_receipt$$

DROP TRIGGER IF EXISTS receipt_update$$

DROP TRIGGER IF EXISTS new_dispatch$$

DROP TRIGGER IF EXISTS dispatch_update$$

DROP TRIGGER IF EXISTS new_transfer$$

DROP TRIGGER IF EXISTS transfer_update$$

CREATE TRIGGER new_receipt 
AFTER INSERT ON `receipt` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, name, receipt_id, receipt_quantity, receipt_datetime, receipt_who_received)
	VALUES (NEW.stock_id, (SELECT name FROM stock WHERE stock_id = NEW.stock_id), NEW.receipt_id, NEW.receipt_quantity, NEW.receipt_datetime, NEW.receipt_who_received);

END$$

CREATE TRIGGER receipt_update
AFTER UPDATE ON `receipt` FOR EACH ROW
BEGIN

	UPDATE report SET receipt_quantity = NEW.receipt_quantity, receipt_datetime = NEW.receipt_datetime, receipt_who_received = NEW.receipt_who_received, voided = NEW.voided, date_voided = NEW.date_voided WHERE receipt_id = NEW.receipt_id;

END$$

CREATE TRIGGER new_dispatch 
AFTER INSERT ON `dispatch` FOR EACH ROW
BEGIN

	INSERT INTO report (stock_id, name, dispatch_id, dispatch_quantity, dispatch_datetime, dispatch_who_dispatched, dispatch_who_received, dispatch_who_authorised, dispatch_destination)
	VALUES (NEW.stock_id, (SELECT name FROM stock WHERE stock_id = NEW.stock_id), NEW.dispatch_id, NEW.dispatch_quantity, NEW.dispatch_datetime, NEW.dispatch_who_dispatched, NEW.dispatch_who_received, NEW.dispatch_who_authorised, NEW.dispatch_destination);

END$$

CREATE TRIGGER dispatch_update
AFTER UPDATE ON `dispatch` FOR EACH ROW
BEGIN

	UPDATE report SET dispatch_quantity = NEW.dispatch_quantity, dispatch_datetime = NEW.dispatch_datetime, dispatch_who_dispatched = NEW.dispatch_who_dispatched, dispatch_who_received = NEW.dispatch_who_received, dispatch_who_authorised = NEW.dispatch_who_authorised, dispatch_destination = NEW.dispatch_destination, voided = NEW.voided, date_voided = NEW.date_voided WHERE dispatch_id = NEW.dispatch_id;

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

DELIMITER ;
