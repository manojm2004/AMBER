from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    hash = pwd_context.hash("testing")
    print("Hashed:", hash)
    print("Verify:", pwd_context.verify("testing", hash))
except Exception as e:
    import traceback
    traceback.print_exc()
