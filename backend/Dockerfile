
FROM python:3.12.6-slim

COPY requirements.txt requirements.txt 

USER root

RUN pip install pandas scikit-learn fastapi uvicorn

# 
COPY . .

# 
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]