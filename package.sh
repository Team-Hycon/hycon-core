#!/bin/bash
set -e

time=$(date +"%Y%m%d_%H%M")
foldername="HYCON_0.0.7_"$time
#build_time=${1:?"requires an argument DateTime" }
os=${1:?"requires an argument macos | linux | win | all" }

if [ $os != "linux" ] && [ $os != "win" ] && [ $os != "macos" ] && [ $os != "all" ] 
then
    echo "================== Error: platform not supported  ==============="
    exit 1
fi

output_dir=bundle-$os
#build_time=$(date +"%Y%m%d_%I%M")
file_name=$foldername'_'$os'.zip'
npm i
npm run clear
npm run test
rm -rf build
tsc
echo "=============== npm  tsc init finish============="
if [ -e "./src/api/clientDist" ]
then    
    rm -rf ./src/api/clientDist
fi

npm run clear
npm run block:build
echo "==================UI build finish==============="
function platform_dependent() {
    local platform=$1
    local output_dir=bundle-$platform
    #build_time=$(date +"%Y%m%d_%I%M")
    local file_name=$foldername'_'$platform'.zip'
    pkg . --target $platform -o hycon
    mkdir $output_dir
    if [ -e $output_dir ]
    then
        rm -rf $output_dir
    fi
    mkdir $output_dir
    cd $output_dir
    cp -rf ../data . 

    cp -f ../platform/$platform/node-modules/* .

    if [ $platform == "win" ]
    then
        cp -f ../hycon.exe .       
        cp -f ../launch.bat .
        rm -rf ../hycon.exe
    elif [ $platform == "linux" ] || [ $platform == "macos" ]
    then
        cp -f ../hycon .
        cp -f ../launch.sh.command .
    else
        echo "================== Error: platform not found ==============="
        exit 1
    fi
    cp -f ../documents/* .
    mkdir node_modules
    cp -rf ../node_modules/react* ./node_modules/

    rm data/config.json
    cp ../platform/$platform/config/* data/
    cp ../platform/$platform/miner/* .

    cd ..
    zip -r $file_name $output_dir
}

if [ $os == "all" ]
then
    platform_dependent "win"
    platform_dependent "linux"
    platform_dependent "macos"
    wait
else
    platform_dependent $os
fi
