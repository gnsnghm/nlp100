#!/bin/bash
#
#	NLP 100
#		q015
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

NN=$1
if is_empty $NN; then
	exit 1
else
	if ! is_number $NN; then
		exit 1
	fi
fi

FILE="test.txt"
if is_file $FILE; then
	tail -n $NN $FILE
fi

