#!/usr/bin/env bash
# Sets up a native PostgreSQL install for the salon backend - no Docker.
# Run with: sudo bash setup-postgres.sh
set -euo pipefail

DB_NAME="salon"
DB_USER="salon"
DB_PASSWORD="${1:-}"

if [ -z "$DB_PASSWORD" ]; then
  echo "Usage: sudo bash setup-postgres.sh <db-password>"
  echo "  (pick a real password - this becomes DB_PASSWORD in the backend's .env)"
  exit 1
fi

echo "Installing PostgreSQL..."
apt-get update -qq
apt-get install -y postgresql postgresql-contrib

echo "Creating database and user..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo
echo "Done. Postgres is running locally on port 5432."
echo "Use this in the backend's .env:"
echo "  DB_URL=jdbc:postgresql://localhost:5432/${DB_NAME}"
echo "  DB_USERNAME=${DB_USER}"
echo "  DB_PASSWORD=${DB_PASSWORD}"
echo
echo "The backend creates its own tables automatically on first boot via"
echo "Flyway - no separate migration step needed."
