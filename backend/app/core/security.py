from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from app.core.config import settings
from app.models.entities import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Mock Current User Dependency for Dev/MVP
class CurrentUser:
    def __init__(self, user_id: str, email: str, role: UserRole, department_id: Optional[str] = None):
        self.id = user_id
        self.email = email
        self.role = role
        self.department_id = department_id

def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> CurrentUser:
    if not token:
        # Dev fallback user
        return CurrentUser(
            user_id="123e4567-e89b-12d3-a456-426614174000",
            email="dr.faculty@university.edu",
            role=UserRole.FACULTY,
            department_id="987f6543-e21b-12d3-a456-426614174000"
        )
    payload = decode_access_token(token)
    return CurrentUser(
        user_id=payload.get("sub", "123e4567-e89b-12d3-a456-426614174000"),
        email=payload.get("email", "dr.faculty@university.edu"),
        role=UserRole(payload.get("role", UserRole.FACULTY)),
        department_id=payload.get("department_id")
    )
