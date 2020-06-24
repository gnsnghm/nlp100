#!/bin/bash
#
#	NLP 100
#		q016
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

NN=$1
FILE="./test.txt"
HEAD="q016_"

if is_empty $NN; then
	exit 1
else
	if ! is_number $NN; then
		exit 1
	fi
fi

if ! is_file $FILE; then
	exit 1
else
	split -l $NN $FILE $HEAD
fi

