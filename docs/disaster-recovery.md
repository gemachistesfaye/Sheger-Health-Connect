# Disaster Recovery Plan - Sheger Health Connect

## 1. RTO/RPO Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **RTO** (Recovery Time Objective) | 4 hours | Maximum acceptable downtime before service is restored |
| **RPO** (Recovery Point Objective) | 1 hour | Maximum acceptable data loss measured in time |
| **MTTR** (Mean Time To Repair) | 2 hours | Average time to resolve a production incident |
| **Availability Target** | 99.9% | ~8.76 hours downtime per year |

## 2. Backup Procedures

### 2.1 Automated Database Backups

- **Frequency**: Every 6 hours via cron job
- **Script**: `backend/scripts/backup-db.sh`
- **Storage**: Encrypted backups stored in `backups/` directory and uploaded to cloud storage
- **Retention**: 7 daily, 4 weekly, 12 monthly

```bash
# Manual backup execution
DB_PASS=<password> ./backend/scripts/backup-db.sh

# Preview without executing
DRY_RUN=true DB_PASS=<password> ./backend/scripts/backup-db.sh
```

### 2.2 Backup Verification

- Weekly backup restoration test to verify integrity
- Checksum validation using SHA-256
- Automated alerting if backup fails

### 2.3 Offsite Backup

- Daily sync of backup files to S3-compatible object storage
- Encryption at rest using AES-256
- Cross-region replication for geographic redundancy

## 3. Recovery Procedures

### 3.1 Database Recovery

1. Stop the application: `docker compose stop backend`
2. Identify the correct backup file from `backups/` directory
3. Decompress the backup: `gunzip backup_file.sql.gz`
4. Drop and recreate the database:
   ```bash
   mysql -u sheger -p -e "DROP DATABASE IF EXISTS sheger_health; CREATE DATABASE sheger_health;"
   ```
5. Restore from backup:
   ```bash
   mysql -u sheger -p sheger_health < backup_file.sql
   ```
6. Restart the application: `docker compose up -d backend`
7. Verify health endpoint: `curl http://localhost/api/health`

### 3.2 Full Stack Recovery

1. Clone the repository: `git clone <repo-url>`
2. Navigate to project directory: `cd sheger-health-connect`
3. Create `.env` file with required environment variables
4. Run: `docker compose up -d`
5. Restore database from latest backup (see 3.1)
6. Verify all services are healthy

### 3.3 Container Recovery

```bash
# Restart a specific service
docker compose restart backend

# Rebuild and restart
docker compose up -d --build backend

# View logs for debugging
docker compose logs -f backend
```

## 4. Data Loss Scenarios & Mitigations

| Scenario | Impact | Mitigation | Recovery |
|----------|--------|------------|----------|
| Accidental data deletion | High | Soft deletes, audit logging | Restore from point-in-time backup |
| Database corruption | Critical | Automated backups, checksums | Restore from latest verified backup |
| Server hardware failure | Critical | Docker containerization, cloud deployment | Redeploy on new infrastructure |
| Ransomware attack | Critical | Offline backups, access controls | Restore from immutable backups |
| Partial service outage | Medium | Health checks, auto-restart | Container auto-recovery |
| Configuration drift | Low | Infrastructure as code, version control | Rebuild from Dockerfile/Compose |

### 4.1 Prevention Measures

- All database writes include audit trail
- Soft deletes enabled on critical tables (users, records, appointments)
- Rate limiting prevents abuse
- Input validation on all endpoints
- HTTPS enforcement via nginx
- Regular security updates via Docker base images

## 5. Emergency Contacts

| Role | Contact | Responsibility |
|------|---------|---------------|
| **System Administrator** | [Admin Email/Phone] | Infrastructure, Docker, nginx |
| **Database Administrator** | [DBA Email/Phone] | MySQL, backups, recovery |
| **Application Developer** | [Dev Lead Email/Phone] | Code, API, application issues |
| **Security Officer** | [Security Email/Phone] | Security incidents, access control |
| **Project Manager** | [PM Email/Phone] | Communication, escalation |

### 5.1 Escalation Procedure

1. **Severity 1 (Critical)**: Service completely down, data breach
   - Immediately notify all contacts
   - Begin recovery procedures
   - Status page update within 15 minutes
2. **Severity 2 (High)**: Major feature broken, performance degradation
   - Notify sysadmin and developer
   - Investigate within 1 hour
3. **Severity 3 (Medium)**: Minor feature issue, workaround available
   - Notify developer
   - Fix in next business day
4. **Severity 4 (Low)**: Cosmetic issue, feature request
   - Log in issue tracker
   - Address in sprint planning

## 6. Testing & Drills

- **Monthly**: Backup restoration test
- **Quarterly**: Full disaster recovery drill
- **Annually**: Review and update this document

## 7. Related Documentation

- [Deployment Guide](deployment.md)
- [Security Guide](security.md)
- [Database Schema](database.md)
