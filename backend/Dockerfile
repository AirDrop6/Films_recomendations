
FROM python:3.12.6-slim

COPY requirements.txt requirements.txt 

# 
RUN pip install fastapi
RUN pip install pandas
RUN pip install scikit-learn
RUN pip install uvicorn

# 
COPY . .

# 
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]