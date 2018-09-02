#!/bin/bash

rm ./MyMemories.zip

zip -r ./MyMemories.zip . -x "*.git*"

aws lambda update-function-code --function-name MyMemories --zip-file fileb://./MyMemories.zip
