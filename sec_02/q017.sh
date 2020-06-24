#!/bin/bash
#
#	NLP 100
#		q017
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

FILE="./test.txt"
if ! is_file $FILE; then
	exit 1
else
	cut -f 1 -d "," $FILE |
		sort |
		uniq
fi



