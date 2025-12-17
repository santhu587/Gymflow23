# MySQL Setup Guide for GymFlow

## Prerequisites

Install MySQL on your system:

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Windows
Download and install from: https://dev.mysql.com/downloads/mysql/

## Step 1: Create MySQL Database

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Create Database:**
```sql
CREATE DATABASE gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create User (Optional but recommended):**
```sql
CREATE USER 'gymflow_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON gym_management.* TO 'gymflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 2: Install Python MySQL Client

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install mysqlclient
```

**Note:** If `mysqlclient` installation fails, try:
```bash
# macOS
brew install mysql-client
export PATH="/usr/local/opt/mysql-client/bin:$PATH"
pip install mysqlclient

# Linux
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
pip install mysqlclient
```

**Alternative:** Use PyMySQL (easier to install):
```bash
pip install PyMySQL
```

Then add to `backend/gym_management/__init__.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

## Step 3: Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

USE_MYSQL=True
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Step 4: Run Migrations

```bash
cd backend
python manage.py migrate
```

## Step 5: Create Superuser

```bash
python manage.py createsuperuser
```

## Step 6: Run Server

```bash
python manage.py runserver
```

## Troubleshooting

### mysqlclient installation fails
- Install MySQL development headers first
- Use PyMySQL as alternative (see Step 2)

### Can't connect to MySQL
- Check MySQL is running: `brew services list` (macOS) or `sudo systemctl status mysql` (Linux)
- Verify credentials in `.env` file
- Check MySQL user has proper permissions

### Database doesn't exist
- Run the CREATE DATABASE command from Step 1
- Verify database name matches in `.env`

### Migration errors
- Make sure database exists
- Check MySQL user has CREATE/ALTER permissions
- Try: `python manage.py migrate --run-syncdb`

## Switch Back to SQLite

If you want to use SQLite instead:
1. Set `USE_MYSQL=False` in `.env` or remove it
2. Delete `db.sqlite3` if it exists
3. Run `python manage.py migrate`

