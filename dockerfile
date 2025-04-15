FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
ENV GUNICORN_WORKERS=2
ENV GUNICORN_TIMEOUT=120
CMD gunicorn -w $GUNICORN_WORKERS --timeout $GUNICORN_TIMEOUT -b 0.0.0.0:5000 app:app