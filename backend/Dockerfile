# 
FROM python:3.12

# 
WORKDIR /backend

# 
COPY ./requirements.txt /backend/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# 
COPY ./src /backend/src

# 
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]