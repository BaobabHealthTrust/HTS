#!/usr/bin/env bash 

ROOT=$(pwd);

STRING=$(node -e "console.log(Object.keys(require('./package.json').dependencies).join(';'))");

PACKAGES=$(echo $STRING | tr ";" "\n");

touch "$ROOT/output.txt";

for package in $PACKAGES; do

	if [ -d "node_modules/$package" ]; then
	
		cd "node_modules/$package";
		
		FILE=$(npm-bundle);
		
		echo "node_modules/$package/$FILE" >> "$ROOT/output.txt";
		
		cd $ROOT;
	
	fi

done

cp ./package.json package.old.json

while read -r line; do

	if [ ${#line} -gt 0 ] && [ -f "$line" ]; then
	
		mv "$line" "$ROOT/dist/lib/";
	
		node -e "var fs = require('fs'); var cg = require('./package.json'); var p = '$line'.split('/'); cg.dependencies[p[1]] = 'file:dist/lib/' + p[2]; fs.writeFileSync('./package.json', JSON.stringify(cg, undefined, 4));";
	
	fi

done < "$ROOT/output.txt";

rm "$ROOT/output.txt";
