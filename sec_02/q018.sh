#!/bin/bash
#
#	NLP 100
#		q018
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

FILE="./test.txt"
if ! is_file $FILE; then
	exit 1
else
	cut -f 3 -d "," $FILE |
		sort -nr
fi



