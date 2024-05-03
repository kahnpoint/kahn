#!/bin/bash

# Function to run the command
run_command() {
        while true; do
                # Run your command here
                npx vitest --watch --pool=forks
                if [ $? -eq 0 ]; then
                        echo "Command completed successfully"
                        break
                else
                        echo "Command failed, restarting..."
                fi
        done
}

# Trap Ctrl+C to exit gracefully
trap ctrl_c INT

ctrl_c() {
        echo "Exiting..."
        exit 0
}

# Start running the command
run_command