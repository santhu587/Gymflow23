"""
Gunicorn configuration for Render deployment
Optimized for free tier with limited memory
"""
import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
backlog = 2048

# Worker processes
# Use fewer workers on free tier to avoid memory issues
workers = 1  # Single worker for free tier
worker_class = "sync"
worker_connections = 1000
timeout = 30  # Reduced timeout
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "gymflow"

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
keyfile = None
certfile = None

