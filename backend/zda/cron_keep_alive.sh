#!/bin/bash
# Run keep-alive bot every 6 hours via Render cron job
# Add this as a Cron Job in Render dashboard:
# Command: cd /opt/render/project/src && python keep_alive.py
# Schedule: 0 */6 * * *
cd "$(dirname "$0")"
python keep_alive.py
