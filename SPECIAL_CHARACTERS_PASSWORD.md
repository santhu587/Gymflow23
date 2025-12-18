# 🔐 Connection String with Special Characters

## ⚠️ Important: URL Encoding Required

Your password `Santhu@587` contains a special character `@` that must be **URL-encoded** in the connection string.

---

## ✅ Your Correct Connection String

```
postgresql://postgres.dernkumctxpnlsveobzi:Santhu%40587@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**Notice:** `@` in password becomes `%40` in connection string!

---

## 🔍 Why URL Encoding?

In connection strings, special characters have special meanings:
- `@` separates username:password from host
- `:` separates username from password
- `/` separates path components

So if your password contains these characters, they must be encoded.

---

## 📝 Common Special Character Encodings

| Character | Encoded | Example |
|-----------|---------|---------|
| `@` | `%40` | `Santhu@587` → `Santhu%40587` |
| `#` | `%23` | `Pass#123` → `Pass%23123` |
| `%` | `%25` | `Pass%123` → `Pass%25123` |
| `&` | `%26` | `Pass&123` → `Pass%26123` |
| `+` | `%2B` | `Pass+123` → `Pass%2B123` |
| `=` | `%3D` | `Pass=123` → `Pass%3D123` |
| `/` | `%2F` | `Pass/123` → `Pass%2F123` |
| `?` | `%3F` | `Pass?123` → `Pass%3F123` |
| `:` | `%3A` | `Pass:123` → `Pass%3A123` |

---

## 🎯 Your Password Encoding

**Your password:** `Santhu@587`

**Encoded in connection string:** `Santhu%40587`

**Full connection string:**
```
postgresql://postgres.dernkumctxpnlsveobzi:Santhu%40587@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

## ✅ Next Steps

1. **Copy this connection string:**
   ```
   postgresql://postgres.dernkumctxpnlsveobzi:Santhu%40587@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```

2. **Go to Render:**
   - Your Service → Environment tab
   - Find `DATABASE_URL`
   - Replace with the connection string above
   - Save

3. **Wait for redeploy** (2-5 minutes)

---

## 🔍 How to Encode Manually

If you need to encode a password manually:

**Python:**
```python
from urllib.parse import quote
password = "Santhu@587"
encoded = quote(password, safe='')
print(encoded)  # Output: Santhu%40587
```

**Online tool:**
- Search "URL encoder" in Google
- Paste your password
- Copy the encoded version

---

## ✅ Verification

After updating in Render, check the logs. You should see:
- ✅ Migrations running successfully
- ✅ No authentication errors
- ✅ Server starting successfully

---

**Your connection string is ready! Copy it from above and paste into Render as `DATABASE_URL`.**

