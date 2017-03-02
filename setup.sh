#!/usr/bin/env bash

ROOT=$(pwd);
	
GIT=$(command -v git);

NODE=$(command -v node);

MYSQL=$(command -v mysql);

DDE_PROTOCOL="http";
DDE_HOST="0.0.0.0";
DDE_PORT="3009";

showMessageBox() 
{
	exec 3>&1
	
  RETVAL=$(dialog --clear --backtitle "$1" --title "$2" --msgbox "$3" 8 51 2>&1 1>&3)
  
  EXIT_CODE=$?
  
  if [ $EXIT_CODE == 255 ]; then
  
  	clear;
  
  	exit;
  
  fi
  
  exec 3>&-	
}

getUserPassword() 
{
	exec 3>&1
	
  RETVAL=$(dialog --clear --backtitle "$1" --title "$2" --passwordbox "$3" 16 51 2>&1 1>&3)
  
  EXIT_CODE=$?
  
  if [ $EXIT_CODE == 1 ] || [ $EXIT_CODE == 255 ]; then
  
  	clear;
  
  	exit;
  
  fi
  
  exec 3>&-	
}

getUserData() 
{
	exec 3>&1
	
  RETVAL=$(dialog --clear --backtitle "$1" --title "$2" --inputbox "$3" 16 51 2>&1 1>&3)
  
  EXIT_CODE=$?
  
  if [ $EXIT_CODE == 1 ] || [ $EXIT_CODE == 255 ]; then
  
  	clear;
  
  	exit;
  
  fi
  
  exec 3>&-	
}

getUserConfirmation()
{
	exec 3>&1
	
  RETVAL=$(dialog --clear --backtitle "$1" --title "$2" --yesno "$3" 10 30 2>&1 1>&3)
  
  EXIT_CODE=$?
  
  if [ $EXIT_CODE == 255 ]; then
  
  	clear;
  
  	exit;
  
  fi
  
  exec 3>&-	
}

getUserOption()
{
	exec 3>&1
	
	declare -a ARR=("${!4}");
	
  RETVAL=$(dialog --clear --backtitle "$1" --title "$2" --menu "$3" 20 51 4 "${ARR[@]}" 2>&1 1>&3)
  
  EXIT_CODE=$?
  
  
  if [ $EXIT_CODE == 1 ] || [ $EXIT_CODE == 255 ]; then
  
  	clear;
  
  	exit;
  
  fi  
  
  exec 3>&-	
}

if [ ${#GIT} == 0 ]; then

  showMessageBox "Application Configuration" "HTS Setup" "Git not found. Installing Git.";

	clear;
	
	sudo apt-get install git;
	
else 

    echo "Git found: OK";

fi

if [ ${#MYSQL} == 0 ]; then

  showMessageBox "Application Configuration" "HTS Setup" "MySQL not found. Installing MySQL.";

	clear;
	
	cd ./dist/pkgs;

	sudo dpkg -R --install .;

	cd "$ROOT";

else

    showMessageBox "Application Configuration" "HTS Setup" "MySQL found: OK";

		clear;
		
fi

if [ ${#NODE} == 0 ]; then

    # echo "Node.js not found...";

    # echo "Installing Node.js";
    
    showMessageBox "Application Configuration" "HTS Setup" "Node.js not found. Installing Node.js.";

		clear;
		
		mkdir node;
		
		if [ ${#OS} -gt 0 ] && [ $(echo "$OS" | tr '[:upper:]' '[:lower:]') == "x86_64" ]; then

			tar xvf ./dist/node-v5.10.1-linux-x64.tar.xz --strip-components=1 -C ./node;
	
		else 

			tar xvf ./dist/node-v5.10.1-linux-x86.tar.xz --strip-components=1 -C ./node;	

		fi

		mkdir node/etc;

		echo '/prefix=/usr/local' > node/etc/npmrc;

		sudo mv node /opt/;

		sudo chown -R root: /opt/node;

		sudo ln -s /opt/node/bin/node /usr/local/bin/node;

		sudo ln -s /opt/node/bin/npm /usr/local/bin/npm;

		sudo npm install dist/pm2-2.4.1.tgz -g;

		sudo ln -s /opt/node/bin/pm2 /usr/bin/pm2;

		sudo env PATH=$PATH:/opt/node/bin /opt/node/lib/node_modules/pm2/bin/pm2 startup upstart -u $USER --hp /home/$USER;

else

    showMessageBox "Application Configuration" "HTS Setup" "Node.js found: OK";

		clear;
		
fi

if [ -f config/couchdb.json ]; then

	showMessageBox "Application Configuration" "HTS Setup" "CouchDB configuration found. OK";

	clear;
	
else

	cp config/couchdb.json.example config/couchdb.json;

fi

if [ -f config/database.json ]; then

	showMessageBox "Application Configuration" "HTS Setup" "MySQL database configuration found. OK";

	clear;
	
else

	cp config/database.json.example config/database.json;

fi

if [ -f config/site.json ]; then

	showMessageBox "Application Configuration" "HTS Setup" "Site configuration found. OK";

	clear;
	
else

	cp config/site.json.example config/site.json;

fi

clear
		
echo
		
nc -z 8.8.8.8 53  >/dev/null 2>&1;
online=$?;

if [[ $online -eq 0 ]]; then

	npm install --save --no-bin-link --production;

	# read -p "Install or update shared dependencies [y/N]: " INSTALL_DEPENDS

	getUserConfirmation "Application Configuration" "HTS Setup" "Install or update shared dependencies?";
				
	case $EXIT_CODE in
		0)
			INSTALL_DEPENDS="y";;
		1)
			INSTALL_DEPENDS="n";;
		255)
			INSTALL_DEPENDS="y";;
	esac

	clear
		
	if [ ${#INSTALL_DEPENDS} -gt 0 ] && [ $(echo "$INSTALL_DEPENDS" | tr '[:upper:]' '[:lower:]') == "y" ]; then

		clear
	
		echo
		
		echo "===================== Dependencies Installation ====================="	
		
		echo 
		
		# read -p "Enter github.com usename: " GIT_USERNAME

	  getUserData "Application Configuration" "Dependencies Installation" "Enter github.com usename: ";
	  
	  GIT_USERNAME=$RETVAL;
	  
	  clear
  
	  getUserPassword "Application Configuration" "Dependencies Installation" "Enter github.com password for '$GIT_USERNAME': ";
	  
	  GIT_PASSWORD=$RETVAL;

		clear

		echo

		if [ -d ../common/modules/ ]; then
	
			echo 
		
			showMessageBox "Application Configuration" "HTS Setup" "Updating ../common/modules/";
	
			cd ../common/modules;
		
			clear
		
			git pull https://$GIT_USERNAME:$GIT_PASSWORD@github.com/BaobabHealthLabs/bht-modules.git;
		
			cd $ROOT;
	
		else
	
			echo 
		
			showMessageBox "Application Configuration" "HTS Setup" "Cloning libraries into ../common/modules/";
	
			mkdir -p ../common;
		
			cd ../common;
		
			clear
		
			git clone https://$GIT_USERNAME:$GIT_PASSWORD@github.com/BaobabHealthLabs/bht-modules.git;
	
			mv bht-modules modules;
	
			cd $ROOT;
	
		fi

		if [ -d ../common/touchscreentoolkit ]; then
	
			echo 
		
			showMessageBox "Application Configuration" "HTS Setup" "Updating ../common/touchscreentoolkit/";
	
			cd ../common/touchscreentoolkit;
		
			clear
		
			git pull https://$GIT_USERNAME:$GIT_PASSWORD@github.com/BaobabHealthLabs/touchscreentoolkit.git;
		
			cd $ROOT;
	
		else
	
			echo 
		
			showMessageBox "Application Configuration" "HTS Setup" "Cloning libraries into ../common/touchscreentoolkit/";
	
			mkdir -p ../common;
		
			cd ../common;
		
			clear
		
			git clone https://$GIT_USERNAME:$GIT_PASSWORD@github.com/BaobabHealthTrust/touchscreentoolkit.git;
	
			cd $ROOT;
	
		fi
	
		if [ ! -d "$ROOT/public/modules" ]; then
	
			cd "$ROOT/public/";
			
			ln -s ../../common/modules/ .;
			
			cd $ROOT;						
	
		fi
	
		if [ ! -d "$ROOT/public/touchscreentoolkit" ]; then
	
			cd "$ROOT/public/";
			
			ln -s ../../common/touchscreentoolkit/ .;
			
			cd $ROOT;
	
		fi
	
		cp ../common/modules/app.js ./app.js;

		clear
	
		git pull https://$GIT_USERNAME:$GIT_PASSWORD@github.com/BaobabHealthTrust/hts.git;

	fi
	
elif [ -d ../common ]; then	

		if [ ! -d "$ROOT/public/modules" ]; then
	
			cd "$ROOT/public/";
			
			ln -s ../../common/modules/ .;
			
			cd $ROOT;						
	
		fi
	
		if [ ! -d "$ROOT/public/touchscreentoolkit" ]; then
	
			cd "$ROOT/public/";
			
			ln -s ../../common/touchscreentoolkit/ .;
			
			cd $ROOT;
	
		fi
	
		cp ../common/modules/app.js ./app.js;
	
fi
		
clear
		
echo
		
# read -p "Configure application [y/N]: " CONFIGURE_APP

getUserConfirmation "Application Configuration" "HTS Setup" "Configure application?";
			
case $EXIT_CODE in
	0)
		CONFIGURE_APP="y";;
	1)
		CONFIGURE_APP="n";;
	255)
		CONFIGURE_APP="y";;
esac

clear		

if [ ${#CONFIGURE_APP} -gt 0 ] && [ $(echo "$CONFIGURE_APP" | tr '[:upper:]' '[:lower:]') == "y" ]; then
		
	clear
	
	echo
		
	echo "===================== DDE Connection ====================="	
		
	echo 
		
	if [ ${#DDE_USERNAME} == 0 ]; then
	
		  # read -p "Enter DDE application usename: " DDE_USERNAME
				
			getUserData "Application Configuration" "DDE Connection" "Enter DDE application usename: ";
			
			DDE_USERNAME=$RETVAL;
			
			clear			

			echo

		  # echo -n "Enter DDE application password for '$DDE_USERNAME': "

		  # read -s DDE_PASSWORD

		  getUserPassword "Application Configuration" "DDE Connection" "Enter DDE application password for '$DDE_USERNAME': ";
		  
		  DDE_PASSWORD=$RETVAL;

			clear

			echo

	fi

	# read -p "Enter site code: " SITE_CODE

	getUserData "Application Configuration" "DDE Connection" "Enter site code: ";
	
	SITE_CODE=$RETVAL;
	
	clear			

	# read -p "Enter DDE host protocol [HTTP/https]: " DDE_PROTOCOL
	
	declare -a PROTOCOL=("1" "http" "2" "https");

	getUserOption "Application Configuration" "DDE Connection" "Enter DDE host protocol: " PROTOCOL[@]

	case $RETVAL in
		1)
			DDE_PROTOCOL="http";;
		2)
			DDE_PROTOCOL="https";;
	esac
		  
	clear
	
	if [ ${#DDE_PROTOCOL} == 0 ]; then
	
		DDE_PROTOCOL="http";
	
	fi
	
	echo

	# read -p "Enter DDE host IP address [default: $DDE_HOST]: " DDE_HOST
	
	getUserData "Application Configuration" "DDE Connection" "Enter DDE host IP address [default: $DDE_HOST]: ";
	
	DDE_HOST=$RETVAL;
	
	clear			

	if [ ${#DDE_HOST} == 0 ]; then
	
		DDE_HOST="0.0.0.0";
	
	fi
	
	echo

	# read -p "Enter DDE host port [default: $DDE_PORT]: " DDE_PORT

	getUserData "Application Configuration" "DDE Connection" "Enter DDE host port [default: $DDE_PORT]: ";
	
	DDE_PORT=$RETVAL;
	
	clear			

	if [ ${#DDE_PORT} == 0 ]; then
	
		DDE_PORT=3009;
	
	fi
	
	clear

	# read -p "Enter target application environment [development/PRODUCTION]: " TARGET_ENV

	declare -a ENVIRONMENTS=("1" "development" "2" "production" "3" "test");

	getUserOption "Application Configuration" "DDE Connection" "Enter target application environment: " ENVIRONMENTS[@]

	case $RETVAL in
		1)
			TARGET_ENV="development";;
		2)
			TARGET_ENV="production";;
		3)
			TARGET_ENV="test";;
	esac
		  
	clear

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
		
	# read -p "Enter MySQL database host IP address [default: $DDE_HOST]: " MYSQL_HOST;
	
	getUserData "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter MySQL database host IP address [default: $DDE_HOST]: ";
	
	MYSQL_HOST=$RETVAL;
	
	clear			

	if [ ${#MYSQL_HOST} == 0 ]; then
	
		MYSQL_HOST="0.0.0.0";
	
	fi
	
	clear

	if [ ${#MYSQL_HOST} == 0 ] && [ ${#DDE_HOST} != 0 ]; then
	
		MYSQL_HOST=$DDE_HOST;
	
	fi
	
	echo

	# read -p "Enter MySQL username: " MYSQL_USERNAME;
	
	getUserData "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter MySQL username: ";
	
	MYSQL_USERNAME=$RETVAL;
	
	clear			

  # echo -n "Enter MySQL password for '$MYSQL_USERNAME': ";

  # read -s MYSQL_PASSWORD;

  getUserPassword "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter MySQL password for '$MYSQL_USERNAME': ";
  
  MYSQL_PASSWORD=$RETVAL;

	clear

	# read -p "Enter HTS made database name [default: hts_$TARGET_ENV]: " HTS_DATABASE;
	
	getUserData "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter HTS main database name [default: hts_$TARGET_ENV]: ";
	
	HTS_DATABASE=$RETVAL;
	
	clear			

	if [ ${#HTS_DATABASE} == 0 ]; then
	
		HTS_DATABASE="hts_$TARGET_ENV";
	
	fi
	
	echo

	# read -p "Enter HTS stock management database name [default: hts_"$TARGET_ENV"_inventory]: " HTS_INVENTORY_DATABASE;
	
	getUserData "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter HTS stock management database name [default: hts_"$TARGET_ENV"_inventory]: ";
	
	HTS_INVENTORY_DATABASE=$RETVAL;
	
	clear			

	if [ ${#HTS_INVENTORY_DATABASE} == 0 ]; then
	
		HTS_INVENTORY_DATABASE="hts_"$TARGET_ENV"_inventory";
	
	fi
	
	echo

	# read -p "Enter HTS quality control database name [default: hts_"$TARGET_ENV"_quality_control]: " HTS_QUALITY_CONTROL_DATABASE;
	
	getUserData "Application Configuration" "MySQL OpenMRS Database Configuration" "Enter HTS quality control database name [default: hts_"$TARGET_ENV"_quality_control]: ";
	
	HTS_QUALITY_CONTROL_DATABASE=$RETVAL;
	
	clear			

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
		
	# read -p "Enter facility full name: " FACILITY;
	
	getUserData "Application Configuration" "Site Details Configuration" "Enter facility full name: ";
	
	FACILITY=$RETVAL;
	
	clear			

	# read -p "Enter facility location: " FACILITY_LOCATION;
	
	getUserData "Application Configuration" "Site Details Configuration" "Enter facility location: ";
	
	FACILITY_LOCATION=$RETVAL;
	
	clear			

	# read -p "Is the facility location the same as HTS location? [Y/n]: " HTS_LOCATION_SAME_AS_FACILITY_LOCATION;
	
	getUserConfirmation "Application Configuration" "Site Details Configuration" "Is the facility location the same as HTS location?";
			
	case $EXIT_CODE in
		0)
			HTS_LOCATION_SAME_AS_FACILITY_LOCATION="y";;
		1)
			HTS_LOCATION_SAME_AS_FACILITY_LOCATION="n";;
		255)
			HTS_LOCATION_SAME_AS_FACILITY_LOCATION="y";;
	esac

	clear		

	if [ ${#HTS_LOCATION_SAME_AS_FACILITY_LOCATION} == 0 ] || [ $(echo "$HTS_LOCATION_SAME_AS_FACILITY_LOCATION" | tr '[:upper:]' '[:lower:]') == "y" ]; then
	
		HTS_LOCATION=$FACILITY_LOCATION;
		
	else
	
		# read -p "Enter HTS facility location: " HTS_LOCATION;
	
		getUserData "Application Configuration" "Site Details Configuration" "Enter HTS facility location: ";
	
		HTS_LOCATION=$RETVAL;
	
		clear			

	fi
	
	echo

	# read -p "Enter auto-incremental HTS identifiers reset month [JAN/feb/mar/apr/may/jun/jul/aug/sep/oct/nov/dec]: " RESET_MONTH
	
	declare -a MONTHS=("1" "January" "2" "February" "3" "March" "4" "April" "5" "May" "6" "June" "7" "July" "8" "August" "9" "September" "10" "October" "11" "November" "12" "December");

	getUserOption "Application Configuration" "Site Details Configuration" "Enter auto-incremental HTS identifiers reset month: " MONTHS[@]

	case $RETVAL in
		1)
			RESET_MONTH="jan";;
		2)
			RESET_MONTH="feb";;
		3)
			RESET_MONTH="mar";;
		4)
			RESET_MONTH="apr";;
		5)
			RESET_MONTH="may";;
		6)
			RESET_MONTH="jun";;
		7)
			RESET_MONTH="jul";;
		8)
			RESET_MONTH="aug";;
		9)
			RESET_MONTH="sep";;
		10)
			RESET_MONTH="oct";;
		11)
			RESET_MONTH="nov";;
		12)
			RESET_MONTH="dec";;
	esac
		  
	clear

	if [ ${#RESET_MONTH} == 0 ]; then
	
		RESET_MONTH="jan";
		
	else
	
		RESET_MONTH=$(echo "$RESET_MONTH" | tr '[:upper:]' '[:lower:]');
	
	fi
	
	# read -p "Is the facility code for HTS the same as that for DDE which is '$SITE_CODE'? [Y/n]: " HTS_FACILITY_CODE_SAME_AS_SITE_CODE
	
	getUserConfirmation "Application Configuration" "Site Details Configuration" "Is the facility code for HTS the same as that for DDE which is '$SITE_CODE'?";
			
	case $EXIT_CODE in
		0)
			HTS_FACILITY_CODE_SAME_AS_SITE_CODE="y";;
		1)
			HTS_FACILITY_CODE_SAME_AS_SITE_CODE="n";;
		255)
			HTS_FACILITY_CODE_SAME_AS_SITE_CODE="y";;
	esac

	clear		

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
		
# read -p "Configure application database [y/N]: " CONFIGURE_APP_DATABASE

getUserConfirmation "Application Configuration" "Application Database" "Configure application database?";
		
case $EXIT_CODE in
	0)
		CONFIGURE_APP_DATABASE="y";;
	1)
		CONFIGURE_APP_DATABASE="n";;
	255)
		CONFIGURE_APP_DATABASE="y";;
esac

clear		

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
	
	# read -p "Do you want to install full database [y/N]: " INSTALL_FULL_DATABASE
	
	getUserConfirmation "Application Configuration" "Application Database" "Do you want to install full database? WARNING: THIS WILL DROP AN EXISTING DATABASE!";
		
	case $EXIT_CODE in
		0)
			INSTALL_FULL_DATABASE="y";;
		1)
			INSTALL_FULL_DATABASE="n";;
		255)
			INSTALL_FULL_DATABASE="y";;
	esac

	clear		
	
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
		
		# read -p "Enter number of locations to create: " NUMBER_OF_LOCATIONS
		
		getUserData "Application Configuration" "Locations Configuration" "Enter number of locations to create: ";
	
		NUMBER_OF_LOCATIONS=$RETVAL;
	
		clear			

		if [ ${#NUMBER_OF_LOCATIONS} -gt 0 ]; then
		
			STR_LOCATIONS=$(node -e "var c = parseInt('$NUMBER_OF_LOCATIONS'); var a = []; for(var i = 0; i < c; i++) a.push(i + 1); console.log(a.join(';'));");
						
			ARR=$(echo $STR_LOCATIONS | tr ";" "\n");

			for i in $ARR; do
	
				echo
				
				# read -p "Enter location $i: " HTS_ROOM
	
				getUserData "Application Configuration" "Locations Configuration" "Enter location $i: ";
	
				HTS_ROOM=$RETVAL;
	
				clear			

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

if [ ${#TARGET_ENV} == 0 ]; then

	# read -p "Enter target application environment [development/PRODUCTION]: " TARGET_ENV

	declare -a ENVIRONMENTS=("1" "development" "2" "production" "3" "test");

	getUserOption "Application Startup Configuration" "HTS Setup" "Enter target application environment: " ENVIRONMENTS[@]

	case $RETVAL in
		1)
			TARGET_ENV="development";;
		2)
			TARGET_ENV="production";;
		3)
			TARGET_ENV="test";;
	esac
		  
	clear

	if [ ${#TARGET_ENV} == 0 ]; then
	
		TARGET_ENV="production"
	
	fi

fi

PM2=$(command -v pm2);

cd $ROOT;

if [ ${#PM2} != 0 ] && [ $EXIT_CODE == 0 ]; then

	if [ -f ./process.json ]; then
	
		node -e "var cg = require('./process.json'); var fs = require('fs'); cg.env_production.NODE_ENV = '$TARGET_ENV'; fs.writeFileSync('./process.json', JSON.stringify(cg, undefined, 4));"
	
	else
	
		node -e "var cg = {'name': 'hts', 'script': 'app.js', 'env_production': {'NODE_ENV':'$TARGET_ENV'}}; var fs = require('fs'); fs.writeFileSync('./process.json', JSON.stringify(cg, undefined, 4));"
	
	fi

	pm2 kill && pm2 start process.json --env $TARGET_ENV;

	pm2 save;

fi

# echo "Done!";

showMessageBox "Application Configuration" "HTS Setup" "Done!";

clear
