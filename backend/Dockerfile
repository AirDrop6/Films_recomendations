
FROM python:3.12-slim

COPY requirements.txt requirements.txt 

USER root

RUN pip install pandas
RUN pip install fastapi --index-url https://pypi.org/simple/
RUN pip install scikit-learn
RUN pip install uvicorn

# 
COPY . .

# 
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]