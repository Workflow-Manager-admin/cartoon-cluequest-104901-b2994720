#!/bin/bash
cd /home/kavia/workspace/code-generation/cartoon-cluequest-104901-b2994720/locked_room_mystery_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

