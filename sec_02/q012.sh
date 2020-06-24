#!/bin/bash
#
#	NLP 100
#		q012
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

FILE="./test.txt"
FILE_COL1="./col1.txt"
FILE_COL2="./col2.txt"

if is_file $FILE; then
	cut -d "," -f 1 $FILE | sed -e 's/ //g' > $FILE_COL1
	cut -d "," -f 2 $FILE | sed -e 's/ //g' > $FILE_COL2
else
	exit 1
fi
