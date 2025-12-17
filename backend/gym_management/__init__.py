# Try to use PyMySQL as MySQLdb (easier installation)
try:
# MySQL support (for local development only)
# Uncomment if using MySQL locally:
# import pymysql
# pymysql.install_as_MySQLdb()
except ImportError:
    # mysqlclient is installed, use that instead
    pass

