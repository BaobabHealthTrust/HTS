#!/usr/bin/env bash

ROOT=$(pwd);
	
NVM_DIR=~/.nvm;

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";

GIT=$(command -v git);

NVM=$(command -v nvm);

NODE=$(command -v node);

DDE_PROTOCOL="http";
DDE_HOST="0.0.0.0";
DDE_PORT="3009";

if [ ${#GIT} == 0 ]; then

  echo "Git not found...";

  echo "Installing Git...";

	sudo apt-get install git;
	
else 

    echo "Git found: OK";

fi

if [ ${#NVM} == 0 ]; then

    echo "NVM not found...";

    echo "Installing NVM...";

    sudo apt-get remove --purge node -y;

    sudo apt-get install build-essential checkinstall -y;

    sudo apt-get install libssl-dev -y;

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash;

    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";

else

    echo "NVM found: OK";

fi

if [ ${#NODE} == 0 ]; then

    echo "Node.js not found...";

    echo "Installing Node.js";

    nvm install 5.10.1;

    nvm use 5.10.1;

    nvm alias default node;

else

    echo "Node.js found: OK";

fi

npm install --save --verbose;

if [ -f config/couchdb.json ]; then

	echo "CouchDB configuration found. OK";
	
else

	cp config/couchdb.json.example config/couchdb.json;

fi

if [ -f config/database.json ]; then

	echo "MySQL database configuration found. OK";
	
else

	cp config/database.json.example config/database.json;

fi

if [ -f config/site.json ]; then

	echo "Site configuration found. OK";
	
else

	cp config/site.json.example config/site.json;

fi

clear
		
echo
		
read -p "Install or update shared dependencies [y/N]: " INSTALL_DEPENDS

clear
		
if [ ${#INSTALL_DEPENDS} -gt 0 ] && [ $(echo "$INSTALL_DEPENDS" | tr '[:upper:]' '[:lower:]') == "y" ]; then

	clear
	
	echo
		
	echo "===================== Dependencies Installation ====================="	
		
	echo 
		
	read -p "Enter github.com usename: " GIT_USERNAME

	echo

	if [ -d ../common/modules/ ]; then
	
		echo 
		
		echo "Updating ../common/modules/";
	
		cd ../common/modules;
		
		git pull https://$GIT_USERNAME@github.com/BaobabHealthLabs/bht-modules.git;
		
		cd $ROOT;
	
	else
	
		echo 
		
		echo "Cloning libraries into ../common/modules/";
	
		mkdir -p ../common;
		
		cd ../common;
		
		git clone https://$GIT_USERNAME@github.com/BaobabHealthLabs/bht-modules.git;
	
		mv bht-modules modules;
	
		cd $ROOT;
	
	fi

	if [ -d ../common/touchscreentoolkit ]; then
	
		echo 
		
		echo "Updating ../common/touchscreentoolkit/";
	
		cd ../common/touchscreentoolkit;
		
		git pull https://$GIT_USERNAME@github.com/BaobabHealthLabs/bht-modules.git;
		
		cd $ROOT;
	
	else
	
		echo 
		
		echo "Cloning libraries into ../common/touchscreentoolkit/";
	
		mkdir -p ../common;
		
		cd ../common;
		
		git clone https://$GIT_USERNAME@github.com/BaobabHealthTrust/touchscreentoolkit.git;
	
		cd $ROOT;
	
	fi
	
	if [ ! -d ./public/modules ]; then
	
		ln -s ../common/modules ./public/modules;
	
	fi
	
	if [ ! -d ./public/touchscreentoolkit ]; then
	
		ln -s ../common/touchscreentoolkit ./public/touchscreentoolkit;
	
	fi
	
	cp ../common/modules/app.js ./app.js;
	
	git pull https://$GIT_USERNAME@github.com/BaobabHealthTrust/hts.git;

fi
		
clear
		
echo
		
read -p "Configure application [y/N]: " CONFIGURE_APP

if [ ${#CONFIGURE_APP} -gt 0 ] && [ $(echo "$CONFIGURE_APP" | tr '[:upper:]' '[:lower:]') == "y" ]; then
		
	clear
	
	echo
		
	echo "===================== DDE Connection ====================="	
		
	echo 
		
	if [ ${#DDE_USERNAME} == 0 ]; then
	
		  read -p "Enter DDE application usename: " DDE_USERNAME

			echo

		  echo -n "Enter DDE application password for '$DDE_USERNAME': "

		  read -s DDE_PASSWORD

			echo

			echo

	fi

	read -p "Enter site code: " SITE_CODE

	echo

	read -p "Enter DDE host protocol [HTTP/https]: " DDE_PROTOCOL
	
	if [ ${#DDE_PROTOCOL} == 0 ]; then
	
		DDE_PROTOCOL="http";
	
	fi
	
	echo

	read -p "Enter DDE host IP address [default: $DDE_HOST]: " DDE_HOST
	
	if [ ${#DDE_HOST} == 0 ]; then
	
		DDE_HOST="0.0.0.0";
	
	fi
	
	echo

	read -p "Enter DDE host port [default: $DDE_PORT]: " DDE_PORT

	if [ ${#DDE_PORT} == 0 ]; then
	
		DDE_PORT=3009;
	
	fi
	
	echo

	read -p "Enter target application environment [development/PRODUCTION]: " TARGET_ENV

	if [ ${#TARGET_ENV} == 0 ]; then

		TARGET_ENV="production";

	else

		TARGET_ENV=$(echo "$TARGET_ENV" | tr '[:upper:]' '[:lower:]')

	fi

	node -e " var fs = require('fs'); \
						var config = (fs.existsSync('./config/couchdb.json') ? 
							JSON.parse(fs.readFileSync('./config/couchdb.json')) : \
							fs.existsSync('./config/couchdb.json.example') ? \
							JSON.parse(fs.readFileSync('./config/couchdb.json.example')) : \
							{\"development\":{},\"production\":{},\"test\":{}}); \
						config[\"$TARGET_ENV\".trim()].protocol = \"$DDE_PROTOCOL\"; \
						config[\"$TARGET_ENV\".trim()].host = \"$DDE_HOST\"; \
						config[\"$TARGET_ENV\".trim()].port = \"$DDE_PORT\"; \
						config[\"$TARGET_ENV\".trim()].username = \"$DDE_USERNAME\"; \
						config[\"$TARGET_ENV\".trim()].password = \"$DDE_PASSWORD\"; \
						config[\"$TARGET_ENV\".trim()].siteCode = \"$SITE_CODE\"; \
						fs.writeFileSync('./config/couchdb.json', JSON.stringify(config, undefined, 4));"

	clear
	
	echo
		
	echo "===================== MySQL OpenMRS Database Configuration =====================";
		
	echo 
		
	read -p "Enter MySQL database host IP address [default: $DDE_HOST]: " MYSQL_HOST;
	
	if [ ${#MYSQL_HOST} == 0 ]; then
	
		MYSQL_HOST=$DDE_HOST;
	
	fi
	
	echo

	read -p "Enter MySQL username: " MYSQL_USERNAME;
	
	echo

  echo -n "Enter MySQL password for '$MYSQL_USERNAME': ";

  read -s MYSQL_PASSWORD;

	echo
		
	echo

	read -p "Enter HTS made database name [default: hts_$TARGET_ENV]: " HTS_DATABASE;
	
	if [ ${#HTS_DATABASE} == 0 ]; then
	
		HTS_DATABASE="hts_$TARGET_ENV";
	
	fi
	
	echo

	read -p "Enter HTS stock management database name [default: hts_"$TARGET_ENV"_inventory]: " HTS_INVENTORY_DATABASE;
	
	if [ ${#HTS_INVENTORY_DATABASE} == 0 ]; then
	
		HTS_INVENTORY_DATABASE="hts_"$TARGET_ENV"_inventory";
	
	fi
	
	echo

	read -p "Enter HTS quality control database name [default: hts_"$TARGET_ENV"_quality_control]: " HTS_QUALITY_CONTROL_DATABASE;
	
	if [ ${#HTS_QUALITY_CONTROL_DATABASE} == 0 ]; then
	
		HTS_QUALITY_CONTROL_DATABASE="hts_"$TARGET_ENV"_quality_control";
	
	fi
	
	node -e " var fs = require('fs'); \
						var config = (fs.existsSync('./config/database.json') ? 
							JSON.parse(fs.readFileSync('./config/database.json')) : \
							fs.existsSync('./config/database.json.example') ? \
							JSON.parse(fs.readFileSync('./config/database.json.example')) : \
							{}); \
						config.host = \"$MYSQL_HOST\"; \
						config.user = \"$MYSQL_USERNAME\"; \
						config.password = \"$MYSQL_PASSWORD\"; \
						config.database = \"$HTS_DATABASE\"; \
						config.stockDatabase = \"$HTS_INVENTORY_DATABASE\"; \
						config.qualityControlDatabase = \"$HTS_QUALITY_CONTROL_DATABASE\"; \
						fs.writeFileSync('./config/database.json', JSON.stringify(config, undefined, 4));";
		
	clear
	
	echo
		
	echo "===================== Site Details Configuration =====================";	
		
	echo 
		
	read -p "Enter facility full name: " FACILITY;
	
	echo

	read -p "Enter facility location: " FACILITY_LOCATION;
	
	echo

	read -p "Is the facility location the same as HTS location? [Y/n]: " HTS_LOCATION_SAME_AS_FACILITY_LOCATION;
	
	if [ ${#HTS_LOCATION_SAME_AS_FACILITY_LOCATION} == 0 ] || [ $(echo "$HTS_LOCATION_SAME_AS_FACILITY_LOCATION" | tr '[:upper:]' '[:lower:]') == "y" ]; then
	
		HTS_LOCATION=$FACILITY_LOCATION;
		
	else
	
		read -p "Enter HTS facility location: " HTS_LOCATION;
	
	fi
	
	echo

	read -p "Enter auto-incremental HTS identifiers reset month [JAN/feb/mar/apr/may/jun/jul/aug/sep/oct/nov/dec]: " RESET_MONTH
	
	if [ ${#RESET_MONTH} == 0 ]; then
	
		RESET_MONTH="jan";
		
	else
	
		RESET_MONTH=$(echo "$RESET_MONTH" | tr '[:upper:]' '[:lower:]');
	
	fi
	
	echo

	read -p "Is the facility code for HTS the same as that for DDE which is '$SITE_CODE'? [Y/n]: " HTS_FACILITY_CODE_SAME_AS_SITE_CODE
	
	if [ ${#HTS_FACILITY_CODE_SAME_AS_SITE_CODE} == 0 ] || [ $(echo "$HTS_FACILITY_CODE_SAME_AS_SITE_CODE" | tr '[:upper:]' '[:lower:]') == "y" ]; then
	
		HTS_FACILITY_CODE=$(echo "$SITE_CODE" | tr '[:lower:]' '[:upper:]' );
	
	else 
	
		read -p "Enter HTS facility code [default: $SITE_CODE]: " HTS_FACILITY_CODE
	
		if [ ${#HTS_FACILITY} == 0 ]; then
		
			HTS_FACILITY_CODE=$(echo "$SITE_CODE" | tr '[:lower:]' '[:upper:]' );
		
		else
	
			HTS_FACILITY_CODE=$(echo "$HTS_FACILITY_CODE" | tr '[:lower:]' '[:upper:]' );
		
		fi
	
	fi
		
	node -e " var fs = require('fs'); \
						var config = (fs.existsSync('./config/site.json') ? 
							JSON.parse(fs.readFileSync('./config/site.json')) : \
							fs.existsSync('./config/site.json.example') ? \
							JSON.parse(fs.readFileSync('./config/site.json.example')) : \
							{}); \
						var months = { \
								'jan': 'January', \
								'feb': 'February', \
								'mar': 'March', \
								'apr': 'April', \
								'may': 'May', \
								'jun': 'June', \
								'jul': 'July', \
								'aug': 'August', \
								'sep':'September', \
								'oct': 'October', \
								'nov': 'November', \
								'dec': 'December'\
						}; \
						config.facility = \"$FACILITY\"; \
						config.location = \"$FACILITY_LOCATION\"; \
						config['htc location'] = \"$HTS_LOCATION\"; \
						config['reset month'] = (months[\"$RESET_MONTH\"] ? months[\"$RESET_MONTH\"] : 'January'); \
						config['facility_code'] = \"$HTS_FACILITY_CODE\"; \
						fs.writeFileSync('./config/site.json', JSON.stringify(config, undefined, 4));";
		
	clear
	
	echo
	
	# public/config/database.settings.json
	if [ -f public/config/dashboard.settings.json ]; then

		echo "Dashboard settings configuration found. OK";
	
	else

		cp public/config/dashboard.settings.json.example public/config/dashboard.settings.json;

	fi

	echo
	
	# public/config/landing.modules.json
	if [ -f public/config/landing.modules.json ]; then

		echo "Landing modules configuration found. OK";
	
	else

		cp public/config/landing.modules.json.example public/config/landing.modules.json;

	fi

	# public/config/landing.settings.json
	if [ -f public/config/landing.settings.json ]; then

		echo "Landing settings configuration found. OK";
	
	else

		cp public/config/landing.settings.json.example public/config/landing.settings.json;

	fi

	# public/config/patient.modules.json
	if [ -f public/config/patient.modules.json ]; then

		echo "Patient modules configuration found. OK";
	
	else

		cp public/config/patient.modules.json.example public/config/patient.modules.json;

	fi

	# public/config/stock.settings.json
	if [ -f public/config/stock.settings.json ]; then

		echo "Stock settings configuration found. OK";
	
	else

		cp public/config/stock.settings.json.example public/config/stock.settings.json;

	fi

	# public/config/user.settings.json
	if [ -f public/config/user.settings.json ]; then

		echo "User settings configuration found. OK";
	
	else

		cp public/config/user.settings.json.example public/config/user.settings.json;

	fi

	# public/config/patient.settings.json
	if [ -f public/config/patient.settings.json ]; then

		echo "Patient settings configuration found. OK";
	
	else

		cp public/config/patient.settings.json.example public/config/patient.settings.json;

	fi

	node -e " var fs = require('fs'); \
						var config = require('./public/config/patient.settings.json'); \
						config.ddePort = \"$DDE_PORT\"; \
						config.ddePath = \"$DDE_PROTOCOL://$DDE_HOST:$DDE_PORT\"; \
						config.ddeUser = \"$DDE_USERNAME\"; \
						config.ddePassword = \"$DDE_PASSWORD\"; \
						config.ddeSiteCode = \"$SITE_CODE\"; \
						fs.writeFileSync('./public/config/patient.settings.json', JSON.stringify(config, undefined, 4));";
		
fi
	
clear
		
echo
		
read -p "Configure application database [y/N]: " CONFIGURE_APP_DATABASE

if [ ${#CONFIGURE_APP_DATABASE} -gt 0 ] && [ $(echo "$CONFIGURE_APP_DATABASE" | tr '[:upper:]' '[:lower:]') == "y" ]; then
	
	if [ ${#TARGET_ENV} == 0 ]; then
	
		TARGET_ENV="development";
	
	fi
	
	if [ ${#MYSQL_HOST} == 0 ]; then
	
		MYSQL_HOST=$(node -e "console.log(require('./config/database.json').host);");
	
	fi
	
	if [ ${#MYSQL_USERNAME} == 0 ]; then
	
		MYSQL_USERNAME=$(node -e "console.log(require('./config/database.json').user);");
	
	fi
	
	if [ ${#MYSQL_PASSWORD} == 0 ]; then
	
		MYSQL_PASSWORD=$(node -e "console.log(require('./config/database.json').password);");
	
	fi
	
	if [ ${#HTS_DATABASE} == 0 ]; then
	
		HTS_DATABASE=$(node -e "console.log(require('./config/database.json').database);");
	
	fi
	
	if [ ${#HTS_INVENTORY_DATABASE} == 0 ]; then
	
		HTS_INVENTORY_DATABASE=$(node -e "console.log(require('./config/database.json').stockDatabase);");
	
	fi
	
	if [ ${#HTS_QUALITY_CONTROL_DATABASE} == 0 ]; then
	
		HTS_QUALITY_CONTROL_DATABASE=$(node -e "console.log(require('./config/database.json').qualityControlDatabase);");
	
	fi
	
	echo
	
	read -p "Do you want to install full database [y/N]: " INSTALL_FULL_DATABASE
	
	if [ ${#INSTALL_FULL_DATABASE} -gt 0 ] && [ $(echo "$INSTALL_FULL_DATABASE" | tr '[:upper:]' '[:lower:]') == "y" ]; then
	
		# Drop databases
		
		echo 
		
		echo "Dropping databases if they exist...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP SCHEMA IF EXISTS $HTS_DATABASE";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP SCHEMA IF EXISTS $HTS_INVENTORY_DATABASE";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP SCHEMA IF EXISTS $HTS_QUALITY_CONTROL_DATABASE";
	
		echo 
		
		echo "Creating databases...";
		
		# Create databases
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "CREATE SCHEMA $HTS_DATABASE";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "CREATE SCHEMA $HTS_INVENTORY_DATABASE";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "CREATE SCHEMA $HTS_QUALITY_CONTROL_DATABASE";
		
		echo 
		
		echo "Loading data...";
		
		# Load initial data
		echo 
		
		echo "Loading OpenMRS schema...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE < ./db/openmrs_1_7_2_concept_server_full_db.sql;
		
		echo 
		
		echo "Loading inventory schema...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_INVENTORY_DATABASE < ./db/inventory.sql;
		
		echo 
		
		echo "Loading quality control schema...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_QUALITY_CONTROL_DATABASE < ./db/quality_control.sql;
				
		echo 
		
		echo "Loading inventory triggers schema...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_INVENTORY_DATABASE < ./db/triggers.sql;
	
		echo 
		
		echo "Loading HTS roles...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE < ./db/htc.roles.sql;
		
		echo 
		
		echo "Loading nationalities...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE < ./db/nationalities.sql;
		
		echo 
		
		echo "Loading HTS initial user attributes...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e 'DELETE FROM person_attribute WHERE person_id = 1; INSERT INTO person_attribute (person_id, value, person_attribute_type_id, creator, date_created, uuid) VALUES((SELECT person_id FROM person LIMIT 1), "HTS-0001", (SELECT person_attribute_type_id FROM person_attribute_type WHERE name = "HTS Provider ID"), (SELECT user_id FROM users LIMIT 1), NOW(), (SELECT UUID()))';
	
		echo 
		
		echo "Loading HTS triggers...";
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE < ./db/htc_triggers.sql;
	
		echo
	
		echo "Loading locations..."
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO location_tag (name, description, creator, date_created, uuid) VALUES ('HTS', 'HTS Locations', (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID()))";
	
		clear
	
		echo 
		
		read -p "Enter number of locations to create: " NUMBER_OF_LOCATIONS
		
		if [ ${#NUMBER_OF_LOCATIONS} -gt 0 ]; then
		
			STR_LOCATIONS=$(node -e "var c = parseInt('$NUMBER_OF_LOCATIONS'); var a = []; for(var i = 0; i < c; i++) a.push(i + 1); console.log(a.join(';'));");
						
			ARR=$(echo $STR_LOCATIONS | tr ";" "\n");

			for i in $ARR; do
	
				echo
				
				read -p "Enter location $i: " HTS_ROOM
	
				mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO location (name, description, creator, date_created, uuid) VALUES ('$HTS_ROOM', 'HTS location', (SELECT user_id FROM users WHERE username = 'admin'), NOW(), (SELECT UUID()))";
	
			done
		
		fi
		
		mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO location_tag_map (location_id, location_tag_id) SELECT location_id, (SELECT location_tag_id FROM location_tag WHERE name = 'HTS') FROM location WHERE description = 'HTS location'";
		
	fi
	
	echo
	
	echo "Loading concepts...";
	
	str=$(node -e "console.log(require('./db/seed.json').concepts.join(';'))")

	str2=$(echo $str | tr "\ " "_");

	arr=$(echo $str2 | tr ";" "\n");

	for concept in $arr; do

		concept=$(echo $concept | tr "_" "\ ");
	
		SQL="SELECT COUNT(*) AS num FROM concept_name LEFT OUTER JOIN concept ON concept.concept_id = concept_name.concept_id WHERE name = '$concept' AND voided = 0 LIMIT 1";
	
		COUNT=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "$SQL") | tr 'num\ ' '\ ');
	
		if [ $COUNT == 0 ]; then
	
			LAST_INSERT_ID=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO concept (retired, datatype_id, class_id, creator, date_created, uuid) VALUES (0, 4, 11, 1, NOW(), (SELECT UUID())); SELECT LAST_INSERT_ID() AS num") | tr 'num\ ' '\ ');
		
			mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO concept_name (concept_id, name, locale, creator, date_created, voided, uuid, concept_name_type) VALUES ('$LAST_INSERT_ID','$concept','en',(SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, (SELECT UUID()), 'FULLY_SPECIFIED')";
		
		fi

	done
	
	echo
	
	echo "Loading encounter_types...";
	
	echo
	
	str=$(node -e "console.log(require('./db/seed.json').encounter_types.map(function(e){return e.join('|')}).join(';'))")

	str2=$(echo $str | tr "\ " "_");

	arr=$(echo $str2 | tr ";" "\n");

	for row in $arr; do

		parts=$(echo $row | tr "|" "\n");
	
		i=0;
		for part in $parts; do
	
			part=$(echo $part | tr "_" "\ ");
	
			if [ $i == 0 ]; then
		
				encounterType=$part;
		
			else
		
				description=$part;
		
			fi
		
			i=1
	
		done
	
		SQL="SELECT COUNT(*) AS num FROM encounter_type WHERE name = '$encounterType' AND retired = 0 LIMIT 1";
	
		COUNT=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "$SQL") | tr 'num\ ' '\ ');
	
		if [ $COUNT == 0 ]; then
	
			mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO encounter_type (name, description, creator, date_created, retired, uuid) VALUES ('$encounterType', '$description', (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, (SELECT UUID()))";
		
		fi

	done
	
	echo "Loading patient_identifier_types...";
	
	echo
	
	str=$(node -e "console.log(require('./db/seed.json').patient_identifier_types.map(function(e){return e.join('|')}).join(';'))")

	str2=$(echo $str | tr "\ " "_");

	arr=$(echo $str2 | tr ";" "\n");

	for row in $arr; do

		parts=$(echo $row | tr "|" "\n");
	
		i=0;
		for part in $parts; do
	
			part=$(echo $part | tr "_" "\ ");
	
			if [ $i == 0 ]; then
		
				identifierType=$part;
		
			else
		
				description=$part;
		
			fi
		
			i=1
	
		done
	
		SQL="SELECT COUNT(*) AS num FROM patient_identifier_type WHERE name = '$identifierType' AND retired = 0 LIMIT 1";
	
		COUNT=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "$SQL") | tr 'num\ ' '\ ');
	
		if [ $COUNT == 0 ]; then
	
			mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO patient_identifier_type (name, description, creator, date_created, retired, uuid) VALUES ('$identifierType', '$description', (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, (SELECT UUID()))";
		
		fi

	done
	
	echo "Loading person_attribute_types..."
	
	echo
	
	str=$(node -e "console.log(require('./db/seed.json').person_attribute_types.map(function(e){return e.join('|')}).join(';'))")

	str2=$(echo $str | tr "\ " "_");

	arr=$(echo $str2 | tr ";" "\n");

	for row in $arr; do

		parts=$(echo $row | tr "|" "\n");
	
		i=0;
		for part in $parts; do
	
			part=$(echo $part | tr "_" "\ ");
	
			if [ $i == 0 ]; then
		
				attributeType=$part;
		
			else
		
				description=$part;
		
			fi
		
			i=1
	
		done
	
		SQL="SELECT COUNT(*) AS num FROM person_attribute_type WHERE name = '$attributeType' AND retired = 0 LIMIT 1";
	
		COUNT=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "$SQL") | tr 'num\ ' '\ ');
	
		if [ $COUNT == 0 ]; then
	
			mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO person_attribute_type (name, description, creator, date_created, retired, uuid) VALUES ('$attributeType', '$description', (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, (SELECT UUID()))";
		
		fi

	done
	
	echo "Loading programs...";
	
	str=$(node -e "console.log(require('./db/seed.json').programs.join(';'))")

	str2=$(echo $str | tr "\ " "_");

	arr=$(echo $str2 | tr ";" "\n");

	for program in $arr; do

		program=$(echo $program | tr "_" "\ ");
	
		PROGRAM_EXISTS=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "SELECT COUNT(*) AS num FROM program WHERE name = '$program'") | tr 'num\ ' '\ ');
	
		if [ $PROGRAM_EXISTS == 0 ]; then 
	
			SQL="SELECT COUNT(*) AS num FROM concept_name LEFT OUTER JOIN concept ON concept.concept_id = concept_name.concept_id WHERE name = '$program' AND voided = 0 LIMIT 1";
	
			COUNT=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "$SQL") | tr 'num\ ' '\ ');
	
			if [ $COUNT == 0 ]; then
	
				CONCEPT_ID=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO concept (retired, datatype_id, class_id, creator, date_created, uuid) VALUES (0, 4, 11, 1, NOW(), (SELECT UUID())); SELECT LAST_INSERT_ID() AS num") | tr 'num\ ' '\ ');
		
				mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO concept_name (concept_id, name, locale, creator, date_created, voided, uuid, concept_name_type) VALUES ('$CONCEPT_ID','$concept','en',(SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, (SELECT UUID()), 'FULLY_SPECIFIED')";
		
				mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO program (concept_id, creator, date_created, retired, name, uuid) VALUES ('$CONCEPT_ID', (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, '$program', (SELECT UUID()))";
		
			else
		
				CONCEPT_ID=$(echo $(mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "SELECT concept_id AS id FROM concept_name WHERE name = '$program' LIMIT 1") | tr 'id\ ' '\ ');
		
				mysql -h $MYSQL_HOST -u $MYSQL_USERNAME -p$MYSQL_PASSWORD $HTS_DATABASE -e "INSERT INTO program (concept_id, creator, date_created, retired, name, uuid) VALUES ('$CONCEPT_ID', (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1), NOW(), 0, '$program', (SELECT UUID()))";
		
			fi
	
		fi

	done
	
fi
		
clear

echo

echo "Done!";

echo
