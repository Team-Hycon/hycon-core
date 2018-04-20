#!/bin/bash
SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd -P )
cd "$SCRIPTPATH"
./hycon --api --api_port=2442 --cpuMiners=1 $@
