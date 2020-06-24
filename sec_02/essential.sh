#!/bin/bash
#
#	essensial.sh
#
#

function is_empty() {
	if [ "$1" = "" ]; then
		return 0
	else
		return 1
	fi
}

function is_number() {
	RES=$(echo "$1" | grep -E "^[0-9]+$")
	if ! is_empty $RES; then
		return 0
	else
		return 1
	fi
}

function is_file() {
	if [ -f $1 ]; then
		return 0
	else
		return 1
	fi
}











