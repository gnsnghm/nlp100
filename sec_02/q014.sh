#!/bin/bash
#
#	NLP 100
#		q014
#
#		2020.06.26 by gnsnghm
#

. ./essential.sh

NN=$1
if is_empty $NN; then
	echo "a"
	exit 1
else
	if ! is_number $N; then
		exit 1
	fi
fi

FILE="test.txt"
if is_file $FILE; then
	head -n $NN $FILE
fi

