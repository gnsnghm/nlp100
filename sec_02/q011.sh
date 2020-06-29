#!/bin/bash
#
#	NLP 100
#		q011
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

FILE="./test.txt"

if is_file $FILE; then
	cat $FILE | sed -e 's/\t/ /g'
else
	exit 1
fi

