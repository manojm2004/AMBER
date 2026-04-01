import requests
import sys

# Get a valid token first
login_data = {
    "username": "manoj",
    "password": "testing_password"  # I need to know a valid password!
}
# wait, instead of guessing password, let's just create a token directly from auth.py
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from backend.auth import create_access_token
from datetime import timedelta

token = create_access_token(data={"sub": "manoj"})
url = f"http://localhost:8000/api/predictions/export_csv?token={token}"
print("Fetching:", url)
res = requests.get(url)
print("Status:", res.status_code)
print("Headers:", res.headers)
print("Content length:", len(res.text))
print("Content preview:", res.text[:200])
