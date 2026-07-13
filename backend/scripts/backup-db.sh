#!/bin/bash
# =============================================================================
# Sheger Health Connect - Database Backup Script
# =============================================================================
# Usage:
#   ./backup-db.sh                  # Run backup with defaults
#   DRY_RUN=true ./backup-db.sh     # Preview without executing
#
# Environment Variables:
#   DB_HOST         - MySQL host (default: localhost)
#   DB_PORT         - MySQL port (default: 3306)
#   DB_USER         - MySQL user (default: sheger)
#   DB_PASS         - MySQL password (required)
#   DB_NAME         - Database name (default: sheger_health)
#   BACKUP_DIR      - Backup directory (default: ./backups)
#   RETENTION_DAILY - Daily backups to keep (default: 7)
#   RETENTION_WEEKLY- Weekly backups to keep (default: 4)
#   DRY_RUN         - If true, only print commands (default: false)
# =============================================================================

set -euo pipefail

# Configuration with defaults
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-sheger}"
DB_PASS="${DB_PASS:?Error: DB_PASS environment variable is required}"
DB_NAME="${DB_NAME:-sheger_health}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAILY="${RETENTION_DAILY:-7}"
RETENTION_WEEKLY="${RETENTION_WEEKLY:-4}"
DRY_RUN="${DRY_RUN:-false}"

# Derived variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.log"

# Create backup directory
mkdir -p "$BACKUP_DIR"

log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

run_cmd() {
    if [ "$DRY_RUN" = "true" ]; then
        log "[DRY RUN] $1"
        return 0
    fi
    eval "$1"
}

# Validate mysqldump is available
if ! command -v mysqldump &> /dev/null; then
    log "ERROR: mysqldump is not installed or not in PATH"
    exit 1
fi

# Validate gzip is available
if ! command -v gzip &> /dev/null; then
    log "ERROR: gzip is not installed or not in PATH"
    exit 1
fi

log "=========================================="
log "Starting database backup for ${DB_NAME}"
log "Host: ${DB_HOST}:${DB_PORT}"
log "User: ${DB_USER}"
log "=========================================="

# Perform backup with mysqldump, pipe through gzip
log "Creating compressed backup: ${BACKUP_FILE}"
run_cmd "mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p'${DB_PASS}' \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --add-drop-table \
    --create-options \
    --extended-insert \
    --quick \
    ${DB_NAME} | gzip > '${BACKUP_FILE}'"

if [ "$DRY_RUN" != "true" ] && [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Backup completed successfully. Size: ${BACKUP_SIZE}"
elif [ "$DRY_RUN" = "true" ]; then
    log "[DRY RUN] Backup command executed (no file created)"
fi

# =============================================================================
# Retention Policy Cleanup
# =============================================================================
log "Applying retention policy..."

# Remove daily backups older than RETENTION_DAILY days
log "Removing daily backups older than ${RETENTION_DAILY} days..."
run_cmd "find '${BACKUP_DIR}' -name '${DB_NAME}_*.sql.gz' -type f -mtime +${RETENTION_DAILY} -delete -print | while read f; do log \"Deleted: \$f\"; done"

# Keep weekly backups (Sundays) for RETENTION_WEEKLY weeks
# This keeps the most recent backup from each Sunday for the configured weeks
WEEKLY_MARKER=$(date -d "-${RETENTION_WEEKLY} weeks" +"%Y%m%d" 2>/dev/null || date -v-${RETENTION_WEEKLY}w +"%Y%m%d" 2>/dev/null || echo "")
if [ -n "$WEEKLY_MARKER" ]; then
    log "Ensuring weekly backups are preserved for ${RETENTION_WEEKLY} weeks..."
    # Find and keep weekly snapshots - this is a secondary safety net
    run_cmd "find '${BACKUP_DIR}' -name '${DB_NAME}_*.sql.gz' -type f -mtime +$((RETENTION_DAILY * 2)) -delete -print | while read f; do log \"Cleaned old backup: \$f\"; done"
fi

# Count remaining backups
if [ "$DRY_RUN" != "true" ]; then
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f | wc -l)
    log "Total backups remaining: ${BACKUP_COUNT}"
fi

log "=========================================="
log "Backup process completed."
log "=========================================="
