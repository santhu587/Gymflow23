# Try to use PyMySQL as MySQLdb (easier installation)
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    # mysqlclient is installed, use that instead
    pass

