# Fix Installation Error

## Problem
Error: `BackendUnavailable: Cannot import 'setuptools.build_meta'`

This happens when pip tries to build packages from source but setuptools is missing or outdated.

## Quick Fix

### Step 1: Upgrade pip and install setuptools
```bash
python.exe -m pip install --upgrade pip
pip install --upgrade setuptools wheel
```

### Step 2: Install requirements again
```bash
pip install -r requirements.txt
```

## Alternative: Install Dependencies Manually

If the above doesn't work, install each package manually:

```bash
pip install --upgrade pip setuptools wheel
pip install fastapi==0.104.1
pip install "uvicorn[standard]==0.24.0"
pip install python-multipart==0.0.6
pip install nibabel==5.2.0
pip install numpy
```

## Why This Happens

- `numpy==1.24.3` is trying to build from source (tar.gz)
- Building from source requires `setuptools`
- Your environment is missing or has an old version of setuptools

## Solution Applied

The `requirements.txt` has been updated to use `numpy>=1.24.0` which will:
- Use pre-built wheels when available (faster, no build needed)
- Still work with the codebase
- Avoid build errors

## After Fixing

Once installed successfully, verify:
```bash
python -c "import fastapi, nibabel, numpy; print('All packages installed!')"
```

Then start the server:
```bash
python -m uvicorn app.main:app --reload
```

