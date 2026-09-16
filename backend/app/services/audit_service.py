import hashlib
import logging
from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.entities import AuditLog

logger = logging.getLogger("qpi.audit")

class AuditService:
    @staticmethod
    def hash_ip(ip_address: str) -> str:
        return hashlib.sha256(ip_address.encode('utf-8')).hexdigest()

    @classmethod
    def log_event(
        cls,
        db: Session,
        action: str,
        resource_id: UUID,
        actor_id: Optional[UUID] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: str = "127.0.0.1"
    ) -> AuditLog:
        ip_hash = cls.hash_ip(ip_address)
        entry = AuditLog(
            actor_id=actor_id,
            action=action,
            resource_id=resource_id,
            details=details or {},
            ip_hash=ip_hash
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        logger.info(f"AUDIT LOG: Action='{action}' Resource='{resource_id}' Actor='{actor_id}'")
        return entry
