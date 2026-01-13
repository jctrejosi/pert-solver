# Cómo colocar a funcionar el backend

## Instalar python

[Download Python | Python.org](https://www.python.org/downloads/)

## Crear la carpeta para el entorno virtual

'''
py -3.11 -m venv venv
'''

## Activar el entorno virtual

'''
venv\Scripts\activate
'''

- Al inicio de la terminal verás **(venv)**, que inidica que estás dentro del entorno virtual.

## Instalar pipenv

'''
python -m pip install pipenv
'''

## Instalar las depenendicas del proyecto

'''
python -m pip install -r requirements.txt
'''

## Tener instalado ollama

[ollama](https://ollama.com/download)

## Configurar la variable de entorno para consultar el modelo en ollama (/.env)

'''
OLLAMA_URL=http://localhost:11434
'''

## Correr el proyecto

'''
python main.py
'''