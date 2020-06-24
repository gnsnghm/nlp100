#!/bin/bash
#
#	NLP 100
#		q013
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

FILE_COL1="./col1.txt"
FILE_COL2="./col2.txt"

if is_file $FILE_COL1; then
	if is_file $FILE_COL2; then
		paste $FILE_COL1 $FILE_COL2
	fi
else
	exit 1
fi
