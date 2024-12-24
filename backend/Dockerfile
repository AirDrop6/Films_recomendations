
FROM python:3.12.6-slim

WORKDIR /usr/app/backend

COPY requirements.txt requirements.txt 


RUN pip install -r requirements.txt

# 
COPY . .

# 
CMD ["uvicorn", "src.main:app", "--host", "87.228.37.133", "--port", "8000"]