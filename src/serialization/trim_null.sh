#!/bin/bash 

sed -i -e 's/?: [(]\(.*\)\s*[|]\s*null[)]/?: \1/g' src/serialization/proto.d.ts
